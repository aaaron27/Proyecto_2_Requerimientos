import {useState, useEffect, useRef} from 'react'

function generateCode() {
    const segmento1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const segmento2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const segmento3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0')

    return `${segmento1}-${segmento2}-${segmento3}`
}

export default function SimpeCard() {
    const [idioma, setIdioma] = useState('')
    const [copied, setCopied] = useState(false)
    const [code, setCode] = useState('')
    
    const defaultMessageRef = useRef(null)
    const successMessageRef = useRef(null)

    useEffect(() => {
        const idioma = window.location.pathname.split('/')[1]
        setIdioma(idioma)

        setCode(generateCode())
    }, [])
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
            <h1 className="text-center font-bold text-lg">Simpe Movil - 8525 5009</h1>
            <p className="text-center text-zinc-500 dark:text-zinc-300">
            {
                idioma == 'es' ? "Para poder hacer una compra primero inicia sesion" : "In order to make a purchase you must first log in"
            }
            </p>
            <div className="flex justify-center flex-wrap">
                <a className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" href={`http://localhost:4321/${idioma}/login`}>
                {idioma == 'es' ? 'Iniciar sesión' : 'Log in'}
                </a>

                <p className="mt-4 mb-4 text-center text-zinc-500 dark:text-zinc-300">
                    {idioma == 'es' ? "Para realizar el pago por favor colocar este código en el contexto/descripción del Sinpe Movil" : "To make the payment please place this code in the context/description of Sinpe Movil"}
                </p>

                <div class="grid grid-cols-8 gap-2 w-full max-w-[23rem]">
                    <input id="npm-install" type="text" class="col-span-6 bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={code} disabled readonly/>

                    <button 
                    onClick={copyToClipboard}
                    data-copy-to-clipboard-target="npm-install" class="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 items-center inline-flex justify-center">
                        <span
                        className={copied ? "hidden" : ''}
                        ref={defaultMessageRef}
                        id="default-message">{idioma == 'es' ? 'Copiar' : 'Copy'}</span>
                        <span 
                        ref={successMessageRef}
                        id="success-message" className={copied ? "" : 'hidden'}>
                            <div class="inline-flex items-center">
                                <svg class="w-3 h-3 text-white me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                                </svg>
                                Copied!
                            </div>
                        </span>
                    </button>
                </div>

                <p className="mt-4 mb-4 text-center text-zinc-500 dark:text-zinc-300">
                    {idioma == 'es' ? "Si ya realizaste el Sinpe Movil al número, presionar el botón para confirmar el vieja" : "If you have already made the Sinpe Movil to the number, press the button to confirm the old one"}
                </p>

                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    {idioma == 'es' ? 'Confirmar' : 'Confirm'}
                </button>
            </div>
        </div>
    )
}