import React from 'react';
import {Button, Modal, Form} from "react-bootstrap";


export default function TicketForm({modalTitle,
                                       showModal,
                                       closeModal,
                                       title,
                                       statuses,
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
                                          placeholder="Title"
                                          onChange={e => {
                                              setTitle(e.target.value);
                                          }}
                                          required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketStatus">
                            <Form.Control as="select"
                                          value={status}
                                          onChange={e => {
                                              setStatus(e.target.value);
                                          }}
                            >
                                {statuses.map((status) => <option value={status}>{status}</option>)}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ticketDescription">
                            <Form.Control type="text"
                                          value={description}
                                          placeholder="Description"
                                          onChange={e => {
                                              setDescription(e.target.value);
                                          }}
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
}