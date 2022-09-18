import React from 'react';
import { Button, Modal, Form } from "react-bootstrap";


export default function TicketForm({modalTitle,
                                       showModal,
                                       closeModal,
                                       title,
                                       status,
                                       description,
                                       setTitle,
                                       setStatus,
                                       setDescription,
                                       submitTicketForm}) {


    return(
        <div>
            <Modal
                show={showModal}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={submitTicketForm}>
                        <Form.Group className="mb-3" controlId="ticketTitle">
                            <Form.Control type="text"
                                          value={title}
                                          placeholder="title"
                                          onChange={titleChanged}
                            />
                        </Form.Group>
                        {/* TODO change to dropdown */}
                        <Form.Group className="mb-3" controlId="ticketStatus">
                            <Form.Control type="text"
                                          value={status}
                                          placeholder="Status"
                                          onChange={statusChanged}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketDescription">
                            <Form.Control type="text"
                                          value={description}
                                          placeholder="Description"
                                          onChange={descriptionChanged}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit">Save</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
      </div>
    );

    function titleChanged(event) {
        setTitle(event.target.value);
    };

    function statusChanged(event) {
        setStatus(event.target.value);
    };

    function descriptionChanged(event) {
        setDescription(event.target.value);
    };

}