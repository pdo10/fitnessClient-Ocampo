import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {

    return (
        <>
        <Row>
            <Col className="p-4 text-center mt-5">
                <h1>Welcome To our Workouts Manager</h1>
                <p>Create, Update, Delete and View Your Workouts</p>
                <Link className="btn btn-primary" to={'/workouts'}>Check Your Workouts</Link>
            </Col>
        </Row>
        </>
    )
}