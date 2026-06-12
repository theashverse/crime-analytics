from flask import Flask, request, jsonify
from flask_cors import CORS
from forecast import get_forecast
from cluster import get_clusters

app = Flask(__name__)
CORS(app, origins=['https://crime-analytics-1.onrender.com', 'http://localhost:5173'])


@app.route('/clusters', methods=['GET'])
def clusters():
    try:
        result = get_clusters()
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/forecast', methods=['GET'])
def forecast():
    state = request.args.get('state', None)
    crime_type = request.args.get('crime_type', None)
    periods = int(request.args.get('periods', 3))

    try:
        result = get_forecast(state, crime_type, periods)
        if result is None:
            return jsonify({ 'error': 'Not enough data to forecast' }), 400
        return jsonify(result)
    except Exception as e:
        return jsonify({ 'error': str(e) }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({ 'status': 'ML service running' })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
