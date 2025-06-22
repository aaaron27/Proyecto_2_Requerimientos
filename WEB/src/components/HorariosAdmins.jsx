import { useEffect, useState } from 'react'

export const HorariosAdmins = ({id_agencia}) => {
    const [posts, setPosts] = useState([])
    const [lugares, setLugares] = useState([])
    const [origen, setOrigen] = useState(null)
    const [destino, setDestino] = useState(null)
    const [precio, setPrecio] = useState('')
    const [horaSalida, setHoraSalida] = useState('')
    const [horaLlegada, setHoraLlegada] = useState('')
    const [formValues, setFormValues] = useState()
    const [idioma, setIdioma] = useState('')

    useEffect(() => {
        const idioma = window.location.pathname.split('/')[1]
        setIdioma(idioma)
    }, [])


    const fetchHorarios = () => {
        fetch(`http://localhost:8000/horarios/nombre/${id_agencia}`)
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(err => console.error(err))
    }

    useEffect(() => {fetchHorarios()}, [])

    useEffect(() => {
        fetch(`http://localhost:8000/lugares`)
        .then(res => res.json())
        .then(data => setLugares(data))
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        const valoresIniciales = {}
        posts.forEach(post => {
            valoresIniciales[post.id] = {
                origen: post.id_origen,
                destino: post.id_destino,
                hora_salida: post.hora_salida,
                hora_llegada: post.hora_llegada,
                precio: post.precio
            }
        })
        setFormValues(valoresIniciales)
    }, [posts])

    const handleChange = (postId, field, value) => {
        setFormValues(prev => ({
            ...prev,
            [postId]: {
                ...prev[postId],
                [field]: value
            }
        }))
    }

    const handleCrearHorario = async (e) => {
        e.preventDefault()

        const horario = {
            origen: parseInt(origen),
            destino: parseInt(destino),
            id_agencia: parseInt(id_agencia),
            precio: parseInt(precio),
            hora_salida: horaSalida,
            hora_llegada: horaLlegada
        }

        console.log(horario)

        const res = await fetch("http://localhost:8000/horarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(horario)
        });

        if (res.ok) fetchHorarios()

        setOrigen('')
        setDestino('')
        setHoraLlegada('')
        setHoraSalida('')
        setPrecio('')
    }

    const handleEliminarHorario = async (id) => {
        const res = await fetch(`http://localhost:8000/horarios/${id}`, {
            method: "DELETE",
        });

        if (res.ok) fetchHorarios();
    };

    const handleUpdateHorario = async (id) => {
        const form = formValues[id];
        console.log(form)
        const res = await fetch(`http://localhost:8000/horarios/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                origen: parseInt(form.origen),
                destino: parseInt(form.destino),
                id_agencia,
                precio: parseInt(form.precio),
                hora_salida: form.hora_salida,
                hora_llegada: form.hora_llegada
            })
        });

        if (res.ok) fetchHorarios();
    };

  return (
    <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
      {
        posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <form className='flex gap-4 flex-wrap'>
                        <select 
                        value={formValues[post.id]?.origen || ''} 
                        onChange={e => handleChange(post.id, 'origen', e.target.value)}
                        id="origen" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value={post.id_origen}>{post.origen}</option>
                            {
                                lugares.map((lugar) => (
                                     <option key={lugar.id+'d'} value={lugar.id}>{lugar.nombre}</option>
                                ))
                            }
                        </select>
                   
                        <select 
                        value={formValues[post.id]?.destino || ''} 
                        onChange={e => handleChange(post.id, 'destino', e.target.value)}
                        id="destino" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value={post.id_destino}>{post.destino}</option>
                            {
                                lugares.map((lugar) => (
                                     <option key={lugar.id + 'd'} value={lugar.id}>{lugar.nombre}</option>
                                ))
                            }
                        </select>

                     
                        <div className='inline'>
                            <input 
                            value={formValues[post.id]?.hora_salida.slice(0,5) || ''}
                            onChange={e => handleChange(post.id, 'hora_salida', e.target.value)}
                            type="time" id="hora_salida" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"required />
                        </div>

                        <div className='inline'>
                            <input 
                            value={formValues[post.id]?.hora_llegada.slice(0,5) || ''}
                            onChange={e => handleChange(post.id, 'hora_llegada', e.target.value)}
                            type="time" id="hora_llegada" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                    </form>
                    
                    </div>
                    <div className="flex items-center gap-2">
                         <input 
                         value={formValues[post.id]?.precio || ''}
                         onChange={e => handleChange(post.id, 'precio', e.target.value)}
                         type="number" id="precio" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                        <button type="button"
                        onClick={() => handleUpdateHorario(post.id)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>

                        <button type="button" 
                         onClick={() => handleEliminarHorario(post.id)}
                         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                </div>
            </div>
        ))
      }
      
      <span className='text-center text-zinc-500'>
        {idioma == 'es' ? 'Crear nuevo horario' : 'Create new schedule'}</span>

        <div id="crearHorario" className="items-center mt-4">
            <form className='flex gap-4 flex-wrap justify-between' onSubmit={handleCrearHorario}>
                <div className='flex gap-4 flex-wrap'>
                    <select id="origen" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                        {
                            lugares.map((lugar) => (
                                <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                            ))
                        }
                    </select>
                
                    <select id="destino" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={destino} onChange={(e) => setDestino(e.target.value)}>
                        {
                            lugares.map((lugar) => (
                                <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                            ))
                        }
                    </select>
                    
                    <input type="time"  step="1" id="hora_salida" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)}/>
                
                    <input type="time" step="1" id="hora_llegada" className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required value={horaLlegada} onChange={(e) => setHoraLlegada(e.target.value)}/>
                </div>

                <div className="flex items-center gap-2">
                    <input type="number" id="precio" aria-describedby="helper-text-explanation" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="550" required value={precio} onChange={(e) => setPrecio(e.target.value)}/>

                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-pointer">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
