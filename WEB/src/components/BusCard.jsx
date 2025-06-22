import {useState, useEffect} from 'react'

export function BusCard({ idCard, title, thumbnail }) {
  const [idioma, setIdioma] = useState('')  
  useEffect(() => {
      const idioma = window.location.pathname.split('/')[1]
      setIdioma(idioma)
  }, [])

  return (
    <a href={`http://localhost:4321/${idioma}/agencias/${idCard}`}>
      <div className="group relative overflow-hidden rounded-lg border bg-white dark:bg-slate-700">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            width={400}
            height={300}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
        </div>
        <div className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-300">{title}</h3>
        </div>
      </div>
    </a>
  )
}