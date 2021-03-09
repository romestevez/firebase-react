import React, {useState}  from 'react'
import {withRouter} from 'react-router-dom'
import {auth,db} from '../firebase'
import moment from 'moment'



const Admin = (props) => {
    const [user, setUser] = React.useState(null)

    const [tareas, setTareas] = useState([])
    const [tarea, setTarea] = useState("")
    const [modoEdicion, setmodoEdicion] = useState(false)
    const [id, setId] = useState("")
    const [error, setError] = useState(null)

    
    React.useEffect(()=>{
        if (auth.currentUser) {
            setUser(auth.currentUser)

        } else {
            props.history.push('/login')
        }
        const obtenerDatos = async () => {
      
            try {
              const data = await db.collection('usuarios').doc(auth.currentUser.email).collection('tareasUsuario').get()
              //console.log(data);
              const arrayData = data.docs.map(doc => ({id:doc.id,...doc.data() }))
              setTareas(arrayData);
            } catch (error) {
              console.log(error);
            }
           
            
          }
          obtenerDatos()

    }, [props.history])

const agregarTarea = async (e) => {
    e.preventDefault()
    if(!tarea.trim()) {
      setError("Escribe algo...")
      return
    }
    try {

      const nuevaTarea = {
        name:tarea,
        fecha:Date.now()
      }
      const data = await db.collection('usuarios').doc(auth.currentUser.email).collection('tareasUsuario').add(nuevaTarea)
      setTareas([
        ...tareas,
        {id:data.id, ...nuevaTarea}
      ])
      setTarea("")
    } catch (error) {
      console.log(error);
    }
  }
  

  const eliminarTarea = async (id) => {
    try {
      
      const data = await db.collection('usuarios').doc(auth.currentUser.email).collection('tareasUsuario').doc(id).delete()
      const arrayFiltrado = tareas.filter(item=>item.id!==id)
      setTareas(arrayFiltrado)

    } catch (error) {
    }
  }
  const activarModoEdicion = (item) => {

    setmodoEdicion(true);
    setTarea(item.name)
    setId(item.id)

  }


  const editarTarea = async (e) => {
    e.preventDefault()
    if(!tarea.trim()) {
      console.log("Escribe algo.....")
      return
    }

    try {
      const tareaCambiada = {
        name:tarea,
        fecha:Date.now()
      }
      const data = await db.collection('usuarios').doc(auth.currentUser.email).collection('tareasUsuario').doc(id)
      const actualizar = data.update(tareaCambiada);
      
      const arrayEditado = tareas.map(

        item => item.id === id? {id:id, name:tarea}:item
      )
      
      // const actualizar = data.set({
      //   name:tarea,
      //   fecha:Date.now()
      // }, {merge:true});

      setTareas(arrayEditado)
      setmodoEdicion(false)
      setTarea("")
      setId("")
      setError(null)
      

    } catch (error) {
      console.log(error)
    }
    
    
  }

    return (
        <div className="container mt-4">
              <h2 className="text-center">FIREBASE</h2>
              <div className="row mt-2">
                <div className="col-7">
                  <h4 className="text-center">Lista de tareas</h4>
                    <ul className="list-group">
                      {
                          tareas.map(item=>
                        <li className="list-group-item" key={item.id}>
                          <span className="lead">{item.name + ":  " + moment(item.fecha).format('LLL')}</span>
                          <button 
                            className="btn btn-danger float-end mx-2"
                            onClick={()=>eliminarTarea(item.id)}
                            >
                            Eliminar
                          </button>
                          <button className="btn btn-warning btn-sm float-end mx-2" onClick={e=>activarModoEdicion(item)}>Editar</button>
                        </li>
                            
                            )
                      }
                    </ul>
                </div>
                <div className="col-5">
                  <div className="col-4">
                    <h4 className="text-center">
                      {
                        modoEdicion ? "Editar tareas" : "Agregar tareas"
                      }
                      
                    </h4>
                    <form onSubmit={modoEdicion ? editarTarea : agregarTarea}>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="Introduce la tarea"  
                        value={tarea}
                        onChange={e=> setTarea(e.target.value)}
                      />

                      {modoEdicion? (
                        <button className="btn btn-warning w-100 mt-2">Guardar cambios</button>
                      ):(
                        <button className="btn btn-dark w-100 mt-2">Agregar</button>)
                        
                      }

                        {
                          error? <span className="text-danger mx-2">{error}</span> : null
                        }
                    

                    </form>
                  </div>
                </div>
              </div>
            </div>
    )
}

export default withRouter(Admin)
