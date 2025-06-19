import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit } from "lucide-react"

export function UsersManage() {
  const [users, setUsers] = useState([])
  const [idioma, setIdioma] = useState('')
  
  useEffect(() => {
      const idioma = window.location.pathname.split('/')[1]
      setIdioma(idioma)
    }, [])

  const fetchUsers = () => {
    fetch('http://localhost:8000/usuarios/')
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error(err))
  }

  useEffect(() => {fetchUsers()}, [])

  const [selectedUser, setSelectedUser] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    id_role: "",
    telefono: ""
  })

  const handleDelete = async (correo_usuario) => {
    const res = await fetch(`http://localhost:8000/usuarios/${correo_usuario}`, {
        method: "DELETE",
    });

    if (res.ok) fetchUsers();
  }

  const handleUpdate = (user) => {
    setSelectedUser(user)
    setFormData({
      correo: user.correo,
      nombre: user.nombre,
      primer_apellido: user.primer_apellido,
      id_role: user.id_role,
      telefono: user.telefono,
      contraseña: user.contraseña
    })
    setIsDialogOpen(true)
  }

  const handleSaveUpdate = async () => {
     if (selectedUser) {
    try {
      const res = await fetch(`http://localhost:8000/usuarios/${selectedUser.correo}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchUsers();
        setIsDialogOpen(false);
        setSelectedUser(null);
      } else {
        const error = await res.json();
        console.error("Error actualizando:", error.detail);
      }
    } catch (err) {
      console.error("Error en la solicitud PATCH:", err);
    }
  }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {idioma == 'es' ? 'Administración de usuarios' : 'User administration'}
        </h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{idioma == 'es' ? 'Nombre' : 'Name'}</TableHead>
              <TableHead>{idioma == 'es' ? 'Correo' : 'Name'}</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">{idioma == 'es' ? 'Acciones' : 'Actions'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.correo}>
                <TableCell className="font-medium">{user.nombre}</TableCell>
                <TableCell>{user.correo}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.id_role}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleUpdate(user)}>
                      <Edit className="w-4 h-4 mr-1" />
                      {idioma == 'es' ? 'Actualizar' : 'Update'}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(user.correo)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      {idioma == 'es' ? 'Eliminar' : 'Delete'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {idioma == 'es' ? 'Actualizar Usuario' : 'Update User'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">{idioma == 'es' ? 'Nombre' : 'Name'}</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Aaron..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correo">{idioma == 'es' ? 'Correo' : 'Email'}</Label>
              <p 
              className='file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
              >{formData.correo}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">{idioma == 'es' ? 'Telefono' : 'Telephone'}</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => handleInputChange("telefono", e.target.value)}
                placeholder="12341234"
              />
            </div>
             <div className="grid gap-2">
              <Label htmlFor="primer_apellido">{idioma == 'es' ? 'Primer apellido' : 'First Last name'}</Label>
              <Input
                id="primer_apellido"
                value={formData.primer_apellido}
                onChange={(e) => handleInputChange("primer_apellido", e.target.value)}
                placeholder="Perez..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="id_role"
                value={formData.id_role}
                onChange={(e) => handleInputChange("id_role", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="1">{idioma == 'es' ? 'Administrador' : 'Administrator'}</option>
                <option value="2">{idioma == 'es' ? 'Agencia' : 'Agency'}</option>
                <option value="3">{idioma == 'es' ? 'Usuario' : 'User'}</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate}>
              {idioma == 'es' ? 'Guardar Cambios' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}