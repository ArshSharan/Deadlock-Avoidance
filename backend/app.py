"""
Flask Backend for College Fest Resource Allocation System
Provides REST API endpoints for Banker's Algorithm operations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
from bankers_algorithm import BankersAlgorithm, format_safe_sequence

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# In-memory storage for logs
allocation_logs = []


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "message": "Banker's Algorithm API is running",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/run-bankers', methods=['POST'])
def run_bankers():
    """
    Main endpoint to run Banker's Algorithm.
    
    Expected JSON payload:
    {
        "allocation": [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
        "max_need": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
        "available": [3, 3, 2],
        "request": {
            "club_id": 0,
            "resources": [0, 2, 0]
        },
        "club_names": ["Drama Club", "Music Club", "Dance Club"]  # Optional
    }
    """
    try:
        data = request.get_json()
        
        # Extract data from request
        allocation = data.get('allocation', [])
        max_need = data.get('max_need', [])
        available = data.get('available', [])
        request_data = data.get('request', {})
        club_names = data.get('club_names', None)
        
        club_id = request_data.get('club_id')
        resources = request_data.get('resources', [])
        
        # Validate required fields
        if not allocation or not max_need or not available:
            return jsonify({
                "error": "Missing required fields: allocation, max_need, or available"
            }), 400
        
        if club_id is None or not resources:
            return jsonify({
                "error": "Missing request data: club_id or resources"
            }), 400
        
        # Initialize Banker's Algorithm
        num_processes = len(allocation)
        num_resources = len(available)
        banker = BankersAlgorithm(num_processes, num_resources)
        
        # Validate input
        is_valid, validation_message = banker.validate_input(allocation, max_need, available)
        if not is_valid:
            return jsonify({
                "error": validation_message
            }), 400
        
        # Run Banker's Algorithm
        result = banker.can_grant_request(
            club_id, 
            resources, 
            allocation, 
            max_need, 
            available
        )
        
        # Format safe sequence with club names
        if result['safe'] and result['safe_sequence']:
            result['safe_sequence'] = format_safe_sequence(
                result['safe_sequence'], 
                club_names
            )
        
        # Log the request
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "club_id": club_id,
            "club_name": club_names[club_id] if club_names else f"Club {club_id}",
            "requested_resources": resources,
            "decision": "GRANTED" if result['safe'] else "DENIED",
            "message": result['message'],
            "safe_sequence": result.get('safe_sequence', [])
        }
        allocation_logs.append(log_entry)
        
        # Add log entry to response
        result['log_entry'] = log_entry
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500


@app.route('/api/check-safety', methods=['POST'])
def check_safety():
    """
    Check if current state is safe without making a request.
    
    Expected JSON payload:
    {
        "allocation": [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
        "max_need": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
        "available": [3, 3, 2],
        "club_names": ["Drama Club", "Music Club", "Dance Club"]  # Optional
    }
    """
    try:
        data = request.get_json()
        
        allocation = data.get('allocation', [])
        max_need = data.get('max_need', [])
        available = data.get('available', [])
        club_names = data.get('club_names', None)
        
        if not allocation or not max_need or not available:
            return jsonify({
                "error": "Missing required fields"
            }), 400
        
        num_processes = len(allocation)
        num_resources = len(available)
        banker = BankersAlgorithm(num_processes, num_resources)
        
        # Validate input
        is_valid, validation_message = banker.validate_input(allocation, max_need, available)
        if not is_valid:
            return jsonify({
                "error": validation_message
            }), 400
        
        # Check safety
        is_safe, safe_sequence = banker.is_safe_state(allocation, max_need, available)
        
        # Calculate need matrix
        need_matrix = banker.calculate_need_matrix(allocation, max_need)
        
        if is_safe:
            formatted_sequence = format_safe_sequence(safe_sequence, club_names)
            return jsonify({
                "safe": True,
                "message": "System is in a safe state",
                "safe_sequence": formatted_sequence,
                "need_matrix": need_matrix
            }), 200
        else:
            return jsonify({
                "safe": False,
                "message": "System is in an unsafe state",
                "safe_sequence": [],
                "need_matrix": need_matrix
            }), 200
            
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500


@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Retrieve all allocation logs."""
    return jsonify({
        "logs": allocation_logs,
        "total_requests": len(allocation_logs)
    }), 200


@app.route('/api/logs/export', methods=['GET'])
def export_logs():
    """Export logs as CSV format."""
    if not allocation_logs:
        return jsonify({
            "error": "No logs available to export"
        }), 404
    
    # Create CSV content
    csv_lines = ["Timestamp,Club Name,Requested Resources,Decision,Message,Safe Sequence"]
    
    for log in allocation_logs:
        timestamp = log['timestamp']
        club_name = log['club_name']
        resources = str(log['requested_resources']).replace(',', ';')
        decision = log['decision']
        message = log['message'].replace(',', ';')
        safe_seq = ' -> '.join(log['safe_sequence']) if log['safe_sequence'] else 'N/A'
        
        csv_lines.append(f"{timestamp},{club_name},{resources},{decision},{message},{safe_seq}")
    
    csv_content = '\n'.join(csv_lines)
    
    return jsonify({
        "csv_content": csv_content,
        "filename": f"allocation_logs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    }), 200


@app.route('/api/reset', methods=['POST'])
def reset_system():
    """Reset the system and clear all logs."""
    global allocation_logs
    allocation_logs = []
    
    return jsonify({
        "message": "System reset successfully",
        "timestamp": datetime.now().isoformat()
    }), 200


@app.route('/api/simulate', methods=['POST'])
def simulate_scenario():
    """
    Simulate a predefined scenario for demonstration.
    
    Expected JSON payload:
    {
        "scenario": "basic" | "complex" | "unsafe"
    }
    """
    try:
        data = request.get_json()
        scenario = data.get('scenario', 'basic')
        
        scenarios = {
            "basic": {
                "allocation": [[0, 1, 0], [2, 0, 0], [3, 0, 2]],
                "max_need": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
                "available": [3, 3, 2],
                "club_names": ["Drama Club", "Music Club", "Dance Club"],
                "description": "Basic safe state scenario"
            },
            "complex": {
                "allocation": [[0, 0, 1, 2], [1, 0, 0, 0], [1, 3, 5, 4], [0, 6, 3, 2], [0, 0, 1, 4]],
                "max_need": [[0, 0, 1, 2], [1, 7, 5, 0], [2, 3, 5, 6], [0, 6, 5, 2], [0, 6, 5, 6]],
                "available": [1, 5, 2, 0],
                "club_names": ["Tech Club", "Art Club", "Sports Club", "Literature Club", "Photography Club"],
                "description": "Complex scenario with 5 clubs and 4 resources"
            },
            "unsafe": {
                "allocation": [[0, 1, 0], [3, 0, 2], [3, 0, 2]],
                "max_need": [[7, 5, 3], [3, 2, 2], [9, 0, 2]],
                "available": [0, 0, 0],
                "club_names": ["Drama Club", "Music Club", "Dance Club"],
                "description": "Unsafe state scenario"
            }
        }
        
        if scenario not in scenarios:
            return jsonify({
                "error": "Invalid scenario. Choose from: basic, complex, unsafe"
            }), 400
        
        return jsonify(scenarios[scenario]), 200
        
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}"
        }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("College Fest Resource Allocation System")
    print("   Banker's Algorithm Backend Server")
    print("=" * 60)
    print("Server starting on http://localhost:5000")
    print("API Endpoints:")
    print("  - POST /api/run-bankers    : Run Banker's Algorithm")
    print("  - POST /api/check-safety   : Check system safety")
    print("  - GET  /api/logs           : Get allocation logs")
    print("  - GET  /api/logs/export    : Export logs as CSV")
    print("  - POST /api/reset          : Reset system")
    print("  - POST /api/simulate       : Load demo scenario")
    print("  - GET  /api/health         : Health check")
    print("=" * 60)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
