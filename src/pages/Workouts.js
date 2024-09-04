import React, { useEffect, useState, useContext } from 'react';
import { Card, Table, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState({});
  const [newWorkout, setNewWorkout] = useState({ name: '', duration: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(UserContext);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/getMyWorkouts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data.workouts)) {
          setWorkouts(data.workouts);
        } else {
          setWorkouts([]);
        }
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        Swal.fire({
          title: 'Error',
          text: `Failed to fetch workouts: ${error.message}`,
          icon: 'error'
        });
        setWorkouts([]);
      });
  }, [token]);



  const handleAddWorkout = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/addWorkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newWorkout.name,
        duration: newWorkout.duration,
        userId: user.id 
      })
    })
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => {
            throw new Error(`Network response was not ok: ${text}`);
          });
        }
        return res.json();
      })
      .then(data => {
        if (data && data.Workout) {
          setWorkouts([...workouts, data.Workout]);
          setShowAddModal(false);
          setNewWorkout({ name: '', duration: '' });
          Swal.fire({
            title: 'Success',
            text: 'Workout added successfully',
            icon: 'success'
          });
        } else {
          throw new Error('Unexpected response format');
        }
      })
      .catch(error => {
        console.error('Error adding workout:', error);
        Swal.fire({
          title: 'Error',
          text: `Failed to add workout: ${error.message}`,
          icon: 'error'
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };



  const handleUpdateWorkout = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/updateWorkout/${currentWorkout._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(currentWorkout)
    })
      .then(res => res.json())
      .then(data => {
        if (data.updatedWorkout) {
          setWorkouts(workouts.map(workout => workout._id === data.updatedWorkout._id ? data.updatedWorkout : workout));
          setShowUpdateModal(false);
          Swal.fire({
            title: 'Success',
            text: 'Workout updated successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to update workout',
            icon: 'error'
          });
          console.error('Error updating workout:', data);
        }
      })
      .catch(error => {
        console.error('Error updating workout:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update workout',
          icon: 'error'
        });
      });
  };

  const handleCompleteWorkout = (workoutId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/completeWorkoutStatus/${workoutId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.completeWorkout) {
          setWorkouts(workouts.map(workout => workout._id === data.completeWorkout._id ? data.completeWorkout : workout));
          Swal.fire({
            title: 'Success',
            text: 'Workout marked as complete',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to complete workout',
            icon: 'error'
          });
          console.error('Error completing workout:', data);
        }
      })
      .catch(error => {
        console.error('Error completing workout:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to complete workout',
          icon: 'error'
        });
      });
  };

  const handleDeleteWorkout = (workoutId) => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/workouts/deleteWorkout/${workoutId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Workout deleted successfully') {
          setWorkouts(workouts.filter(workout => workout._id !== workoutId));
          Swal.fire({
            title: 'Success',
            text: 'Workout deleted successfully',
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete workout',
            icon: 'error'
          });
          console.error('Error deleting workout:', data);
        }
      })
      .catch(error => {
        console.error('Error deleting workout:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete workout',
          icon: 'error'
        });
      });
  };

  const isAddFormValid = newWorkout.name.trim() !== '' && newWorkout.duration.trim() !== '';
  const isUpdateFormValid = currentWorkout.name && currentWorkout.name.trim() !== '' && currentWorkout.duration && currentWorkout.duration.trim() !== '';

  return (
  <Card className="mt-3">
    <Card.Header>
      <h3>Workouts</h3>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add New Workout</Button>
    </Card.Header>
    <Card.Body>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((workout, index) => (
            <tr key={workout._id}>
              <td>{index + 1}</td>
              <td>{workout.name}</td>
              <td>{workout.duration}</td>
              <td>{workout.status}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => { setCurrentWorkout(workout); setShowUpdateModal(true); }}
                >
                  Update
                </Button>{' '}
                <Button
                  variant="success"
                  onClick={() => handleCompleteWorkout(workout._id)}
                  disabled={workout.status === 'Completed'}
                >
                  Complete
                </Button>{' '}
                <Button
                  variant="danger"
                  onClick={() => handleDeleteWorkout(workout._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card.Body>

      {/* Add Workout Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} aria-labelledby="addWorkoutModalLabel">
        <Modal.Header closeButton>
          <Modal.Title id="addWorkoutModalLabel">Add New Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter workout name" value={newWorkout.name} onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formWorkoutDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="text" placeholder="Enter workout duration" value={newWorkout.duration} onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })} />
            </Form.Group>
          </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleAddWorkout} disabled={!isAddFormValid}>Save Workout</Button>
            </Modal.Footer>
          </Modal>

      {/* Update Workout Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formWorkoutName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Enter workout name" value={currentWorkout.name} onChange={(e) => setCurrentWorkout({ ...currentWorkout, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formWorkoutDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="text" placeholder="Enter workout duration" value={currentWorkout.duration} onChange={(e) => setCurrentWorkout({ ...currentWorkout, duration: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateWorkout} disabled={!isUpdateFormValid}>Update Workout</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
}
