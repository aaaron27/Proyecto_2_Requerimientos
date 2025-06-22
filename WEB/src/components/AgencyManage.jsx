import { useEffect, useState } from 'react'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Edit } from "lucide-react"

export function AgencyManage() {
  const [agencias, setAgencias] = useState([])
  const [idioma, setIdioma] = useState('')
  
  useEffect(() => {
      const idioma = window.location.pathname.split('/')[1]
      setIdioma(idioma)
    }, [])

  useEffect(() => {
    fetch('http://localhost:8000/agencias/')
        .then(res => res.json())
        .then(data => setAgencias(data))
        .catch(err => console.error(err))
  }, [])

  const [selectedAgency, setSelectedAgency] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: '',
    nombre: "",
    url_img: '',
    correo_usuario: '',
  })

  const handleDelete = (id) => {
    fetch(`http://localhost:8000/agencias/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al eliminar agencia");
        }
        setAgencias((prev) => prev.filter((agencia) => agencia.id !== id));
      })
      .catch((err) => console.error("Error al eliminar agencia:", err));
  }

  const handleUpdate = (agencia) => {
    setSelectedAgency(agencia)
    setFormData({
      id: agencia.id,
      nombre: agencia.nombre,
      url_img: agencia.url_img,
      correo_usuario: agencia.correo_usuario,
    })
    setIsDialogOpen(true)
  }

  const handleSaveUpdate = () => {
    fetch('http://localhost:8000/agencias/', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al actualizar la agencia")
        return res.json() 
      })
      .then(updatedAgency => {
        setAgencias(agencias.map((agencia) =>
          agencia.id === updatedAgency.id ? updatedAgency : agencia
        ))
        setIsDialogOpen(false)
        setSelectedAgency(null)
      })
      .catch(err => {
        console.error("Error al actualizar la agencia:", err)
      })
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCreateAgency = () => {
    fetch('http://localhost:8000/agencias/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newAgency) => {
        setAgencias((prev) => [...prev, newAgency])
        setFormData({ id: '', nombre: '', url_img: '', correo_usuario: '' })
        setIsCreateDialogOpen(false)
      })
      .catch((err) => console.error('Error al crear agencia:', err))
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-3">
          { idioma == 'es' ? 'Administración de agencias' : 'Agency management' }
        </h1>

        <Button variant="outline" size="sm" onClick={() => {
          setFormData({id: '', nombre: '', 'url_img': '', correo_usuario: ''})
          setIsCreateDialogOpen(prev => !prev)
        }}>
          <Edit className="w-4 h-4 mr-1" />
          {idioma == 'es' ? 'Crear' : 'Create'}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                { idioma == 'es' ? 'Nombre' : 'Name' }
              </TableHead>
              <TableHead>
                { idioma == 'es' ? 'Propietario' : 'Owner' }
              </TableHead>
              <TableHead className="text-right">
                { idioma == 'es' ? 'Acciones' : 'Actions' }
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agencias.map((agencia) => (
              <TableRow key={agencia.id}>
                <TableCell className="font-medium">{agencia.nombre}</TableCell>
                <TableCell>{agencia.correo_usuario}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleUpdate(agencia)}>
                      <Edit className="w-4 h-4 mr-1" />
                      { idioma == 'es' ? 'Actualizar' : 'Update' }
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(agencia.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      { idioma == 'es' ? 'Eliminar' : 'Delete' }
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
              {idioma == 'es' ? 'Actualizar Agencia' : 'Update Agency'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">{ idioma == 'es' ? 'Nombre' : 'Name' }</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Aaron..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correo">
                {idioma == 'es' ? 'Correo Propietario' : 'Proprietary Email'}
              </Label>
              <Input
                id="correo_usuario"
                type="email"
                value={formData.correo_usuario}
                onChange={(e) => handleInputChange("correo_usuario", e.target.value)}
                placeholder="user@gmail.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url_img">
                {idioma == 'es' ? 'Url Imagen' : 'Url image'}
              </Label>
              <Input
                id="url_img"
                value={formData.url_img}
                onChange={(e) => handleInputChange("url_img", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {idioma == 'es' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveUpdate}>
              {idioma == 'es' ? 'Guardar Cambios' : 'Save changes'}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {idioma == 'es' ? 'Crear Agencia' : 'Create Agency'}
              </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">{ idioma == 'es' ? 'Nombre' : 'Name' }</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Aaron..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correo">{idioma == 'es' ? 'Correo Propietario' : 'Proprietary Email'}</Label>
              <Input
                id="correo_usuario"
                type="email"
                value={formData.correo_usuario}
                onChange={(e) => handleInputChange("correo_usuario", e.target.value)}
                placeholder="user@gmail.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url_img">{idioma == 'es' ? 'Url Imagen' : 'Url image'}</Label>
              <Input
                id="url_img"
                value={formData.url_img}
                onChange={(e) => handleInputChange("url_img", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAgency}>
              {idioma == 'es' ? 'Insertar agencia' : 'Insert Agency'} </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}