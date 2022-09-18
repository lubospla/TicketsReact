import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {Button} from "react-bootstrap";
import TicketForm from "./TicketForm";

const TODO = 'TODO';
const DOING = 'DOING';
const DONE = 'DONE';

const grid = 8;

/**
 * Reorder an items in the list.
 */
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [ticket] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, ticket);
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    let status = droppableDestination.droppableId === '0' ? TODO : droppableDestination.droppableId === '1' ? DOING : DONE;
    updateTicketStatus(ticket, status);

    return result;
};

const getItemStyle = (draggableStyle) => ({
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: "15px",
    background: "#ade6d8",
    // styles we need to apply on draggables
    ...draggableStyle
});
const getListStyle = () => ({
    background: "white",
    padding: grid,
    width: 350,
    border: "0.5px solid gray"
});

function updateTicketStatus(ticket, newStatus) {

    ticket.status = newStatus;

    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: ticket.title,
            status: newStatus,
            description: ticket.description
        })
    };
    fetch('http://localhost:8080/v1/tickets/' + ticket.id, requestOptions);
}

function deleteTicket(id, callback) {
    fetch('http://localhost:8080/v1/tickets/' + id,{ method: 'DELETE' });
    callback();
}

const formatDate = (datetime) => {
    let date = new Date(datetime);
    return date.getDate() +'.'+ (date.getMonth()+1) + '.'+date.getFullYear() + '  ' + date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds();
};


function App() {
    const [state, setState] = useState([[], [], []]);
    const [modalTitle, setModalTitle] = useState();
    const [showModal, setShowModal] = useState();
    const [title, setTitle] = useState();
    const [status, setStatus] = useState();
    const [description, setDescription] = useState();
    const [editTicketId, setEditTicketId] = useState();
    const [editTicket, setEditTicket] = useState();

    useEffect(() => {
        fetch('http://localhost:8080/v1/tickets', {method : 'GET'})
            .then(response => response.json())
            .then(
                (tickets) => {
                    const todo = tickets.filter(ticket => {
                        return ticket.status === TODO;
                    });
                    const doing = tickets.filter(ticket => {
                        return ticket.status === DOING;
                    });
                    const done = tickets.filter(ticket => {
                        return ticket.status === DONE;
                    });
                    setState([todo, doing, done]);
                }
            )
    }, []);

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }
        const sInd = +source.droppableId;
        const dInd = +destination.droppableId;

        if (sInd === dInd) {
            const items = reorder(state[sInd], source.index, destination.index);
            const newState = [...state];
            newState[sInd] = items;
            setState(newState);
        } else {
            const result = move(state[sInd], state[dInd], source, destination);
            const newState = [...state];
            newState[sInd] = result[sInd];
            newState[dInd] = result[dInd];
            setState(newState);
        }
    }

    function toggleModal () {
        setShowModal(!showModal);
    }

    function submitTicket() {
        if(editTicket) {
            changeTicket();
        } else {
            createTicket();
        }
    }

    function createTicket() {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title,
                status: status,
                description: description
            })
        };
        fetch('http://localhost:8080/v1/tickets', requestOptions)
            .then(window.location.reload(false));
    }

    function changeTicket() {
        const requestOptions = {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title: title,
                status: status,
                description: description
            })
        };
        fetch('http://localhost:8080/v1/tickets/' + editTicketId, requestOptions)
            .then(window.location.reload(false));
    }

    return (
        <div style={{marginTop: "25px"}}>
            <div style={{ display: "flex" }}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {state.map((el, ind) => (
                        <Droppable key={ind} droppableId={`${ind}`}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    style={getListStyle()}
                                    {...provided.droppableProps}
                                >
                                    {el.map((item, index) => (
                                        <Draggable
                                            key={item.id}
                                            draggableId={item.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(
                                                        provided.draggableProps.style
                                                    )}
                                                >
                                                    <div>
                                                        <div className="row" style={{marginBottom:10}}>
                                                            <div className="col">
                                                                <span>{item.title}</span>
                                                            </div>
                                                            <div className="col-md-auto">
                                                                <span>{item.status}</span>
                                                            </div>
                                                        </div>
                                                        <div className="row" style={{marginBottom:10}}>
                                                            <span>{item.description}</span>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col"><span style={{fontSize:12}}>
                                                                {formatDate(item.dateTime)}
                                                            </span></div>
                                                            <div className="col-md-auto">
                                                                <Button
                                                                    className="btn btn-sm"
                                                                    onClick={() => {
                                                                        setModalTitle("Edit Ticket");
                                                                        setEditTicket(true);
                                                                        setEditTicketId(item.id);
                                                                        setTitle(item.title);
                                                                        setStatus(item.status);
                                                                        setDescription(item.description);
                                                                        toggleModal();
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </div>
                                                            <div className="col-md-auto">
                                                                <Button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() => {
                                                                        deleteTicket(item.id, function () {
                                                                            const newState = [...state];
                                                                            newState[ind].splice(index, 1);
                                                                            setState(newState);
                                                                        });
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
            <Button
                variant="primary"
                style={{margin:25}}
                onClick={() => {
                    setModalTitle("Add Ticket");
                    setEditTicket(false);
                    toggleModal();
                }}
            >
                Add Ticket
            </Button>
            <TicketForm
                modalTitle={modalTitle}
                showModal={showModal}
                closeModal={toggleModal}
                title={title}
                status={status}
                description={description}
                setTitle={setTitle}
                setStatus={setStatus}
                setDescription={setDescription}
                submitTicketForm={submitTicket}
            ></TicketForm>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
