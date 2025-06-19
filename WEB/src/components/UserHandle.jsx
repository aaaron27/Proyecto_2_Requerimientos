import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function UserHandle() {
    const [isOpen, setIsOpen] = useState(false)
    const [isDark, setDark] = useState(false)
    const [idioma, setIdioma] = useState('')
    const [correo, setCorreo] = useState(undefined)
    const [selectedIdioma, setSelectedIdioma] = useState(null)
  
    useEffect(() => {
        const idioma = window.location.pathname.split('/')[1]
        setIdioma(idioma)
        setSelectedIdioma(idioma == 'es')
        const correo1 = Cookies.get('correo')
        setCorreo(correo1)
    }, [])

    useEffect(() => {
        const theme = localStorage.getItem('theme')
        if (theme === 'dark'){
            setDark(true)
            document.documentElement.classList.add('dark')
        } else {
            setDark(false)
            document.documentElement.classList.remove('dark')
        }
    }, [])

    const handleChangeLanguage = (e) => {
        const pathParts = window.location.pathname.split("/");
        pathParts[1] = e;
        const newPath = pathParts.join("/");

        setIdioma(e)
        setSelectedIdioma(e == 'es')
        window.location.href = newPath
    }

    const handleLogout = () => {
        Cookies.remove('id_role')
        Cookies.remove('correo')

        window.location.href = '/' + idioma + '/login'
    }

    const handleChangeTheme = () => {
        if (isDark){
            localStorage.setItem('theme', 'light')
            document.documentElement.classList.remove('dark')
            setDark(false)
        } else {
            localStorage.setItem('theme', 'dark')
            document.documentElement.classList.add('dark')
            setDark(true)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="w-96"/>
                <div className="flex items-center gap-4">
                <button 
                    onClick={() => setIsOpen(prev => !prev)}
                    id="menu-button" aria-expanded="true" aria-haspopup="true" className="h-8 w-8 overflow-hidden rounded-full hover:scale-125 transition cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 h-full w-full object-cover">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                </button>
                </div>
            </div>

            {isOpen && <div className="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden dark:bg-gray-800" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1" role="none">
                <div className="block px-4 py-2 text-sm text-gray-700 dark:text-white font-medium flex justify-between" role="menuitem" tabIndex={-1} id="menu-item-0">
                    {idioma == 'es' ? 'Modo Noche' : 'Night Mode'}
                    <label className="inline-flex items-center cursor-pointer">
                    <input id="theme-selector" type="checkbox" className="sr-only peer" checked={isDark} onChange={handleChangeTheme}/>
                    <label htmlFor="theme-selector" className="inline-flex items-center cursor-pointer">
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-600">
                        <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform
                        ${isDark ? 'translate-x-full' : 'translate-x-0'}`}>
                        </div>
                    </div>
                    </label>
                </label>
                </div>
                <div className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex={-1} id="menu-item-1">
                    <form id="languajeSelect" className="max-w-sm mx-auto">
                    <label htmlFor="languajes" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{idioma == 'es' ? 'Lenguajes' : 'Languages'}</label>
                    <select id="languajes" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={idioma} onChange={e => handleChangeLanguage(e.target.value)}
                    >
                    <option value="es">{idioma == 'es' ? 'Español' : 'Spanish'}</option>
                    <option value="en">{idioma == 'es' ? 'Inglés' : 'English'}</option>
                    </select>
                </form>
                </div>
                    {correo && (<form id="cerrarSesionBtn" method="POST" action="#" role="none">
                        <button 
                        type="button" 
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-white font-medium" role="menuitem" tabIndex={-1} id="menu-item-2">
                            {idioma == 'es' ? 'Cerrar Sesion' : 'Log out'}</button>
                    </form>)}
                </div>
            </div>
        }
        </>
    )
}