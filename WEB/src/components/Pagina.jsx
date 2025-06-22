import { cn } from "@/lib/utils"
import { LayoutGrid } from "lucide-react"
import { useEffect, useState } from 'react'
import { HorariosUsuarios } from './HorariosUsuarios.jsx'
import { HorariosAdmins } from './HorariosAdmins.jsx'
import SimpeCard from "./SimpeCard.jsx"
import '../styles/global.css'

function NavItem({ href, icon, children, active }) {
  return (
    <a
      href={href}
      className={cn("flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg", active && "bg-gray-100")}
    >
      {icon}
      <span>{children}</span>
    </a>
  )
}

export default function FileManager({idCard, privilegios}) {
  const [post, setPost] = useState(null)
  const [notas, setNotas] = useState([])
  const [nota, setNota] = useState('')
  const [nombreAgencia, setNombreAgencia] = useState('')
  const [url_img, setUrl_img] = useState('')
  const [idioma, setIdioma] = useState('')
  
    useEffect(() => {
        const idioma = window.location.pathname.split('/')[1]
        setIdioma(idioma)
    }, [])
  
  useEffect(() => {
      fetch(`http://localhost:8000/agencias/${idCard}`)
      .then(res => res.json())
      .then(data => {
        setPost(data)
        setNombreAgencia(data.nombre)
        setUrl_img(data.url_img)
      })
      .catch(err => console.error(err))
  }, [])
    
  const fetchNotas = () => {
      fetch(`http://localhost:8000/notas/agencias/${idCard}`)
      .then(res => res.json())
      .then(data => setNotas(data))
      .catch(err => console.error(err))
  }

  useEffect(() => {fetchNotas()}, [])

  const handleEliminarNota = async (id_nota) => {
    const res = await fetch(`http://localhost:8000/notas/${id_nota}`, {
      method: "DELETE",
    });
    
    if (res.ok) fetchNotas();
  }

  const handleCrearNota = async (e) => {
    e.preventDefault()
    
    const nueva_nota = {
      texto: nota,
      id_agencia: idCard,
    }

    const res = await fetch(`http://localhost:8000/notas`, {
      method: "POST",
      headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nueva_nota)
    });

    if (res.ok) fetchNotas();

    setNota('')
  }

  const handleChangeNombreAgencia = async () => {
    const res = await fetch(`http://localhost:8000/agencias/${idCard}`, {
      method: "PATCH",
      headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre: nombreAgencia })
    });
  }

  const handleChangeUrlImg = async () => {
    const res = await fetch(`http://localhost:8000/agencias/${idCard}`, {
      method: "PATCH",
      headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url_img: url_img })
    });

  }

  if (post == null) return <p>{idioma == 'es' ? 'Cargando' : 'Loading'}</p>

  return (
    <div className="flex h-fit flex-wrap">
      <div className="w-64">
        <img src={post.url_img}/>
        <div className="p-4">
          { privilegios ? (
            <div className="flex gap-2 justify-between">
              <input 
              value={nombreAgencia}
              onChange={(e) => setNombreAgencia(e.target.value)}
              type="text" 
              id="nombre_agencia" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

              <button type="button"
                onClick={handleChangeNombreAgencia} 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              </button>
            </div>
          ) : (
            <h1 className="text-xl font-bold">{post.nombre}</h1>
          )}
          
        </div>
        <nav className="pl-4 pr-4">
          { privilegios && (
            <div className="flex gap-2 justify-between">
              <input 
              value={url_img}
              onChange={e => setUrl_img(e.target.value)}
              type="text" 
              id="url_img" 
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>

              <button type="button"
                onClick={handleChangeUrlImg} 
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              </button>
            </div>
          )}
        
          <div className="py-3">
            <div className="px-3 text-xl font-medium uppercase text-gray-500 dark:text-gray-300">
              {idioma == 'es' ? 'Notas' : 'Notes'}
            </div>
            <div className="mt-2">
                {
                    notas.map((nota) => (
                        <p key={nota.id} className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                          <span className="break-all">{nota.texto}</span>
                          {privilegios && 
                            <button type="button"
                              onClick={() => handleEliminarNota(nota.id)} 
                              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                          } 
                        </p>
                    ))
                }
                {
                  privilegios && 
                  <form onSubmit={handleCrearNota}>
                    <p className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-700">
                        <input type="text" id="texto" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 break-all" placeholder="Nota 1..." value={nota} onChange={(e) => setNota(e.target.value)}></input>
                          <button type="submit" 
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </button>
                    </p>
                  </form>
                }
            </div>
          </div>
        </nav>
      </div>
      
      <div className="flex-1">       
        <div className="flex flex-wrap">
          <div className="w-2/3 p-4 min-w-[300px]">
            {privilegios 
              ? <HorariosAdmins id_agencia={idCard}/>
              : <HorariosUsuarios id_agencia={idCard}/>
            }
          </div>
          <div className="w-1/3 p-4 min-w-[250px]">
            <SimpeCard/>
          </div>
        </div>
      </div>
  </div>
  )
}
