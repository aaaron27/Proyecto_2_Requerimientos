import { useEffect, useState } from 'react'

export const HorariosUsuarios = ({id_agencia}) => {
    const [posts, setPosts] = useState([])
    const [idioma, setIdioma] = useState('')

    useEffect(() => {
      const idioma = window.location.pathname.split('/')[1]
      setIdioma(idioma)
    }, [])


    useEffect(() => {
        fetch(`http://localhost:8000/horarios/nombre/${id_agencia}`)
        .then(res => res.json())
        .then(data => setPosts(data))
        .catch(err => console.error(err))
    }, [])

    if (!posts) return <p>{idioma == 'es' ? 'cargando...' : 'Loading'}</p>

  return (
    <div className="space-y-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
      {
        posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4  text-sm text-zinc-500 dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span>{post.origen}</span>
                  <span>-</span>
                  <span>{post.destino}</span>
                  <span>|</span>
                  <span>{post.hora_salida.slice(0,5)}</span>
                  <span>-</span>
                  <span>{post.hora_llegada.slice(0,5)}</span>
                </div>

                <p>{post.precio} ₡</p>
            </div>
        ))
      }
      
    </div>
  )
}
