import { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import DatePicker, { registerLocale } from "react-datepicker";

import { addHours, differenceInSeconds } from 'date-fns';
import es from 'date-fns/locale/es';

import "react-datepicker/dist/react-datepicker.css";

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useUiStore } from '../../hooks/useUiStore';
import { useCalendarStore } from '../../hooks/useCalendarStore';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '60%'
    },
};

registerLocale('es', es);
Modal.setAppElement('#root');

export const CalendarModal = () => {

    const [formValues, setformValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2)
    })

    const [formSubmitted, setFormSubmitted] = useState(false);

    const { isDateModalOpen, closeDateModal } = useUiStore();

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.title.length > 0)
            ? 'is-valid'
            : 'is-invalid';
    }, [formValues.title, formSubmitted]);

    const { activeEvent, startSavingEvent } = useCalendarStore();

    useEffect(() => {
        if (activeEvent !== null) {
            setformValues({ ...activeEvent});
        }
    }, [activeEvent]);



    function onInputChange({ target }) {
        setformValues({
            ...formValues,
            [target.name]: target.value
        });
    }

    function onDateChanged(event, changing) {
        setformValues({
            ...formValues,
            [changing]: event
        });
    }

    async function onSubmit(event) {
        event.preventDefault();
        setFormSubmitted(true);

        const difference = differenceInSeconds(formValues.end, formValues.start);

        if (isNaN(difference) || difference <= 0) {
            Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error');
            return;
        }

        if (formValues.title.length <= 0) return;

        await startSavingEvent(formValues); // Guardar o Actualizar evento
        closeDateModal(); // Cerrar modal
        setFormSubmitted(false); // Reiniciar env??o de formulario
    }

    return (
        <Modal
            isOpen={isDateModalOpen}
            onRequestClose={() => closeDateModal()}
            style={customStyles}
            className='modal'
            overlayClassName='modal-fondo'
            closeTimeoutMS={200}
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form className="container" onSubmit={onSubmit}>

                <div className="form-group mb-2">
                    <label>Fecha y hora inicio</label>
                    {/* <input className="form-control" placeholder="Fecha inicio" /> */}
                    <DatePicker selected={formValues.start} onChange={(event) => onDateChanged(event, 'start')}
                        dateFormat='Pp' className='form-control' showTimeSelect locale='es' timeCaption='Hora' />
                </div>

                <div className="form-group mb-2">
                    <label>Fecha y hora fin</label>
                    {/* <input className="form-control" placeholder="Fecha inicio" /> */}
                    <DatePicker minDate={formValues.start} selected={formValues.end} onChange={(event) => onDateChanged(event, 'end')}
                        dateFormat='Pp' className='form-control' showTimeSelect locale='es' timeCaption='Hora' />
                </div>

                <hr />
                <div className="form-group mb-2">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${titleClass}`}
                        placeholder="T??tulo del evento"
                        name="title"
                        autoComplete="off"
                        value={formValues.title}
                        onChange={onInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripci??n corta</small>
                </div>

                <div className="form-group mb-2">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={formValues.notes}
                        onChange={onInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Informaci??n adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
