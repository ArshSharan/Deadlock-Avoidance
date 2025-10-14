"""
Banker's Algorithm Implementation for Deadlock Avoidance
Implements the core logic for safe state checking and resource allocation
"""

from typing import List, Tuple, Dict, Optional
import copy


class BankersAlgorithm:
    """
    Implementation of Banker's Algorithm for deadlock avoidance.
    
    The algorithm ensures that resource allocation keeps the system in a safe state,
    preventing potential deadlocks in resource allocation scenarios.
    """
    
    def __init__(self, num_processes: int, num_resources: int):
        """
        Initialize the Banker's Algorithm.
        
        Args:
            num_processes: Number of processes (clubs)
            num_resources: Number of resource types (Stage, Projector, Sound)
        """
        self.num_processes = num_processes
        self.num_resources = num_resources
    
    def calculate_need_matrix(self, allocation: List[List[int]], 
                             max_need: List[List[int]]) -> List[List[int]]:
        """
        Calculate the Need matrix (Max - Allocation).
        
        Args:
            allocation: Current allocation matrix
            max_need: Maximum need matrix
            
        Returns:
            Need matrix showing remaining resource requirements
        """
        need = []
        for i in range(len(allocation)):
            process_need = []
            for j in range(len(allocation[0])):
                process_need.append(max_need[i][j] - allocation[i][j])
            need.append(process_need)
        return need
    
    def is_safe_state(self, allocation: List[List[int]], 
                     max_need: List[List[int]], 
                     available: List[int]) -> Tuple[bool, List[int]]:
        """
        Check if the system is in a safe state using Banker's Algorithm.
        
        Args:
            allocation: Current allocation matrix
            max_need: Maximum need matrix
            available: Available resources vector
            
        Returns:
            Tuple of (is_safe, safe_sequence)
            - is_safe: Boolean indicating if system is in safe state
            - safe_sequence: List of process indices in safe execution order
        """
        n = len(allocation)
        m = len(available)
        
        # Calculate need matrix
        need = self.calculate_need_matrix(allocation, max_need)
        
        # Make copies to avoid modifying original data
        work = available.copy()
        finish = [False] * n
        safe_sequence = []
        
        # Try to find a safe sequence
        while len(safe_sequence) < n:
            found = False
            
            for i in range(n):
                if not finish[i]:
                    # Check if process i can be satisfied
                    can_allocate = True
                    for j in range(m):
                        if need[i][j] > work[j]:
                            can_allocate = False
                            break
                    
                    if can_allocate:
                        # Simulate allocation and release
                        for j in range(m):
                            work[j] += allocation[i][j]
                        
                        finish[i] = True
                        safe_sequence.append(i)
                        found = True
                        break
            
            # If no process could be allocated, system is unsafe
            if not found:
                return False, []
        
        return True, safe_sequence
    
    def can_grant_request(self, process_id: int, 
                         request: List[int],
                         allocation: List[List[int]], 
                         max_need: List[List[int]], 
                         available: List[int]) -> Dict:
        """
        Determine if a resource request can be safely granted.
        
        Args:
            process_id: ID of the requesting process
            request: Requested resources vector
            allocation: Current allocation matrix
            max_need: Maximum need matrix
            available: Available resources vector
            
        Returns:
            Dictionary containing:
            - safe: Boolean indicating if request can be granted
            - message: Description of the decision
            - safe_sequence: Safe execution order (if safe)
            - need_matrix: Updated need matrix
            - new_available: Available resources after allocation
        """
        # Calculate need matrix
        need = self.calculate_need_matrix(allocation, max_need)
        
        # Validation 1: Request should not exceed need
        for i in range(len(request)):
            if request[i] > need[process_id][i]:
                return {
                    "safe": False,
                    "message": f"Error: Request exceeds maximum need for Club {process_id}",
                    "safe_sequence": [],
                    "need_matrix": need,
                    "new_available": available
                }
        
        # Validation 2: Request should not exceed available resources
        for i in range(len(request)):
            if request[i] > available[i]:
                return {
                    "safe": False,
                    "message": f"Error: Insufficient resources available. Request denied.",
                    "safe_sequence": [],
                    "need_matrix": need,
                    "new_available": available
                }
        
        # Simulate allocation
        new_allocation = copy.deepcopy(allocation)
        new_available = available.copy()
        
        for i in range(len(request)):
            new_allocation[process_id][i] += request[i]
            new_available[i] -= request[i]
        
        # Check if new state is safe
        is_safe, safe_sequence = self.is_safe_state(new_allocation, max_need, new_available)
        
        if is_safe:
            new_need = self.calculate_need_matrix(new_allocation, max_need)
            return {
                "safe": True,
                "message": "Request granted successfully. System remains in safe state.",
                "safe_sequence": safe_sequence,
                "need_matrix": new_need,
                "new_available": new_available,
                "new_allocation": new_allocation
            }
        else:
            return {
                "safe": False,
                "message": "Request denied. Granting would lead to unsafe state (potential deadlock).",
                "safe_sequence": [],
                "need_matrix": need,
                "new_available": available
            }
    
    def validate_input(self, allocation: List[List[int]], 
                      max_need: List[List[int]], 
                      available: List[int]) -> Tuple[bool, str]:
        """
        Validate input matrices for correctness.
        
        Args:
            allocation: Current allocation matrix
            max_need: Maximum need matrix
            available: Available resources vector
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check dimensions
        if len(allocation) != len(max_need):
            return False, "Allocation and Max Need matrices must have same number of processes"
        
        if len(allocation) == 0:
            return False, "At least one process is required"
        
        if len(allocation[0]) != len(available):
            return False, "Number of resources must match in all matrices"
        
        # Check that allocation doesn't exceed max need
        for i in range(len(allocation)):
            for j in range(len(allocation[0])):
                if allocation[i][j] > max_need[i][j]:
                    return False, f"Allocation exceeds max need for Process {i}, Resource {j}"
                if allocation[i][j] < 0 or max_need[i][j] < 0:
                    return False, "Resource values cannot be negative"
        
        # Check available resources are non-negative
        for i in range(len(available)):
            if available[i] < 0:
                return False, "Available resources cannot be negative"
        
        return True, "Valid input"


def format_safe_sequence(sequence: List[int], club_names: Optional[List[str]] = None) -> List[str]:
    """
    Format safe sequence with club names or default naming.
    
    Args:
        sequence: List of process indices
        club_names: Optional list of club names
        
    Returns:
        List of formatted club names
    """
    if club_names:
        return [club_names[i] for i in sequence]
    else:
        return [f"Club {i}" for i in sequence]
