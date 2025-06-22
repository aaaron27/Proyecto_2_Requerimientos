import { useEffect, useState } from 'react'
import { FileCard } from './FileCard'

export default function GoComponent() {
    const [lugares, setLugares] = useState([])
    const [origen, setOrigen] = useState(null)
    const [destino, setDestino] = useState(null)
    const [agencias, setAgencias] = useState([])
    const [idioma, setIdioma] = useState('')
  
    useEffect(() => {
        const idioma = window.location.pathname.split('/')[1]
        setIdioma(idioma)
    }, [])

    useEffect(() => {
        fetch('http://localhost:8000/lugares')
            .then((res) => res.json())
            .then((data) => setLugares(data))
    }, [])

    const encontrarAgencias = async () => {
        if (!origen || !destino) {
            alert('Debes seleccionar origen y destino');
            return;
        }

        try {
            const [horariosRes, rutasRes, agenciasRes] = await Promise.all([
                fetch('http://localhost:8000/horarios'),
                fetch('http://localhost:8000/rutas'),
                fetch('http://localhost:8000/agencias')
            ]);

            const horarios = await horariosRes.json();
            const rutas = await rutasRes.json();
            const agenciasData = await agenciasRes.json();

            // Agregar origen y destino a cada horario
            const horariosConRuta = horarios.map(h => {
                const ruta = rutas.find(r => r.id === h.id_ruta);
                return {
                    ...h,
                    origen: ruta?.origen,
                    destino: ruta?.destino
                };
            });

            const agenciasMap = {};
            for (const h of horariosConRuta) {
                if (!agenciasMap[h.id_agencia]) {
                    agenciasMap[h.id_agencia] = [];
                }
                agenciasMap[h.id_agencia].push({ origen: h.origen, destino: h.destino });
            }

            function existeCamino(grafo, inicio, fin, visitados = new Set()) {
                if (inicio === fin) return true;
                visitados.add(inicio);
                const vecinos = grafo[inicio] || [];
                for (const vecino of vecinos) {
                    if (!visitados.has(vecino)) {
                        if (existeCamino(grafo, vecino, fin, visitados)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            const agenciasValidas = [];

            for (const [idAgencia, rutasAgencia] of Object.entries(agenciasMap)) {
                const grafo = {};
                rutasAgencia.forEach(({ origen, destino }) => {
                    if (!grafo[origen]) grafo[origen] = [];
                    grafo[origen].push(destino);
                });

                if (existeCamino(grafo, origen, destino)) {
                    agenciasValidas.push(parseInt(idAgencia));
                }
            }

            const resultado = agenciasData.filter(a => agenciasValidas.includes(a.id));
            setAgencias(resultado);

        } catch (err) {
            console.error("Error:", err);
        }
    };


    return (
        <div className="flex flex-col gap-10 ">
            <div
            className="ml-10 mr-10 bg-gray-800 dark:bg-sky-400 rounded-xl flex align-center justify-between p-10 items-center"
            >
                <div className="flex justify-start gap-10">
                    <form>
                        <label
                            htmlFor="countries"
                            className="block mb-2 text-sm font-medium dark:text-gray-900 text-white"
                            >{idioma == 'es' ? 'Origen' : 'Origin'}</label
                        >
                        <select
                            value={origen}
                            onChange={e => setOrigen(Number(e.target.value))}
                            id="countries"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value=''>
                                {idioma == 'es' ? 'Escoge el lugar de origen' : 'Choose the place of origin'}
                            </option>
                            {
                                lugares.map((lugar) => (
                                    <option key={lugar.id} value={lugar.id}>
                                        {lugar.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </form>

                    <form>
                        <label
                            htmlFor="countries"
                            className="block mb-2 text-sm font-medium dark:text-gray-900 text-white"
                            >{idioma == 'es' ? 'Destino' : 'Destination'}</label
                        >
                        <select
                            value={destino}
                            onChange={e => setDestino(Number(e.target.value))}
                            id="countries"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                            <option value=''>
                                {idioma == 'es' ? 'Escoge tu destino' : 'Choose your destination'}
                            </option>
                            {
                                lugares.map((lugar) => (
                                    <option key={lugar.id + '1'} value={lugar.id}>
                                        {lugar.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </form>
                </div>
                <div>
                    <button
                        onClick={encontrarAgencias}
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            {idioma == 'es' ? 'Encontrar agencias' : 'Find agencies'}</button
                    >
                </div>

            </div>
            {agencias.length > 0 && (
                <div className="ml-10 mr-10 bg-gray-800 dark:bg-sky-400 rounded-xl flex align-center justify-between p-10 items-center gap-5 flex-wrap">
                        {agencias.map((agencia) => (
                            <div className="w-100" key={agencia.id}>
                                <FileCard
                                    idCard={agencia.id} 
                                    title={agencia.nombre} 
                                    thumbnail={agencia.url_img}
                                />
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    )
}