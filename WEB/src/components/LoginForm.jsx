import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import "../styles/global.css"
import { useState, useEffect } from "react"
import Cookies from "js-cookie"

export function LoginForm() {
  const [isNewUser, setIsNewUser] = useState(false)

  const [correo, setCorreo] = useState("");
  const [nombre, setNombre] = useState("");
  const [primer_apellido, setPrimerApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [id_role, setId_role] = useState(false);
  const [contraseña, setContraseña] = useState("");
  const [idioma, setIdioma] = useState('')

  useEffect(() => {
    const idioma = window.location.pathname.split('/')[1]
    setIdioma(idioma)
  }, [])

  const handleRegister = async (e) => {
    e.preventDefault()

    const user = {
      correo,
      nombre,
      primer_apellido,
      id_role: id_role ? 2 : 3,
      telefono,
      contraseña
    }

    try{
      const res = await fetch("http://localhost:8000/usuarios/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
      });

      if (!res.ok) throw new Error("Error al crear usuario")

      const data = await res.json()
      Cookies.set("id_role", data.id_role, {expires: 7, path: "/"})
      Cookies.set("correo", data.correo, {expires: 7, path: "/"})

      setCorreo("");
      setNombre("");
      setPrimerApellido("");
      setTelefono("");
      setId_role(false);
      setContraseña("");
      setIsNewUser(false);

      window.location.href = '/' + idioma
      
    } catch (error) {
      if (idioma == 'es'){
        alert("No se pudo crear el usuario");
      } else {
        alert("User could not be created");
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    const user = {
      correo,
      contraseña
    }

    const res = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    if (!res.ok) throw new Error("Credenciales inválidas");

    const data = await res.json();

    Cookies.set("id_role", data.id_role, {expires: 7, path: "/"})
    Cookies.set("correo", data.correo, {expires: 7, path: "/"})

    setCorreo('')
    setContraseña('')

    window.location.href = '/' + idioma
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          {isNewUser ? <div><form className="p-6 md:p-8"  onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  { idioma == 'es' ? 'Bienvenido' : 'Welcome' }
                </h1>
                <p className="text-balance text-muted-foreground">
                  { idioma == 'es' ? 'Logeate con tu cuenta' : 'Login with your account' } 
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="correo">Email</Label>
                <Input id="correo" type="email" placeholder="m@example.com" required value={correo} onChange={(e) => setCorreo(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="contraseña">
                    { idioma == 'es' ? 'Contraseña' : 'Password' }
                  </Label>
                </div>
                <Input id="contraseña" type="password" required value={contraseña} onChange={(e) => setContraseña(e.target.value)}/>
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            { idioma == 'es' ? 'No tienes una cuenta?' : 'Dont have an account?' }{" "}
            <button onClick={() => setIsNewUser(prev => !prev)} className="underline underline-offset-4">
              { idioma == 'es' ? 'Registrarse' : 'Register'}
            </button>
          </div></div>
          : <div><form className="p-6 md:p-8" onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  { idioma == 'es' ? 'Bienvenido' : 'Welcome'}
                </h1>
                <p className="text-balance text-muted-foreground">
                  { idioma == 'es' ? 'Create una nueva cuenta' : 'Create a new account' }
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="correo" type="email" placeholder="m@example.com" required value={correo} onChange={(e) => setCorreo(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="text">
                  {idioma == 'es' ? 'Nombre' : 'Name' }
                </Label>
                <Input id="nombre" type="text" placeholder="Aaron" required value={nombre} onChange={(e) => setNombre(e.target.value)}/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="text">
                  { idioma == 'es' ? 'Primer apellido' : 'First last name' }
                </Label>
                <Input id="primer_apellido" type="text" placeholder="Perez" required value={primer_apellido} onChange={(e) => setPrimerApellido(e.target.value)}/>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="telefono">
                  { idioma == 'es' ? 'Telefono' : 'Telephone'}
                </Label>
                <Input id="telefono" type="telefono" placeholder="0000-0000" required value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
              </div>
               <div className="grid gap-2">
                <Label htmlFor="agencia">
                  { idioma == 'es' ? 'Eres un gestor de agencia?' : 'Are you an agency manager?'}
                </Label>
                <Input id="id_role" type="checkbox" value={id_role} onChange={(e) => setId_role(e.target.checked)}/>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="contraseña">
                    { idioma == 'es' ? 'Contraseña' : 'Password'}
                  </Label>
                </div>
                <Input id="contraseña" type="password" required  value={contraseña} onChange={e => setContraseña(e.target.value)}/>
              </div>
              <Button type="submit" className="w-full">
                { idioma == 'es' ? 'Registrarse' : 'Register'}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm">
            { idioma == 'es' ? 'Ya tienes cuenta?' : 'Already have an account?'}{" "}
            <button onClick={() => setIsNewUser(prev => !prev)} className="underline underline-offset-4">
              { idioma == 'es' ? 'Iniciar sesion' : 'Login'}
            </button>
          </div></div>  
        }
          <div className="relative hidden bg-muted md:block ">
            <img
              src="../../public/img.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover rounded-tl-xl rounded-bl-xl"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
