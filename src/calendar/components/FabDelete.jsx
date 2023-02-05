import { useCalendarStore } from "../../hooks/useCalendarStore";

export const FabDelete = () => {

    const { startDeleteEvent, hasEventSelected } = useCalendarStore();

    const handleClickDelete = () => {
        startDeleteEvent();
    }

    return (
        <button onClick={() => handleClickDelete()} className="btn btn-danger fab-danger" style={{display: hasEventSelected? '':'none'}}>
            <i className="fas fa-trash-alt"></i>
        </button>
    )
}
