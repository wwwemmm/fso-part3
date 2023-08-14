import { useState, useEffect} from 'react'
import axios from 'axios'
import personService from './services/persons'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import { Persons, Filter} from './components/Persons'


const App = () => {
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilterName, setNewFilterName] = useState('')
  const [persons, setPersons] = useState([{}])
  const [notification, setNotification] = useState({message:null, type:null})
  
  useEffect(() => {
    console.log('effect')
    personService.getAll()
      .then(persons => {
        console.log('promise fulfilled')
        setPersons(persons)
      })
  }, [])


  const addName = (event) => {
    // don't forget event.preventDefault()
    event.preventDefault()
    console.log('button clicked', event.target)

    if (newName === "") {
      alert(`Please type in a Name!`)
      return
    }

    if (newNumber === "") {
      alert(`Please type in the number!`)
      return
    }
    //const persons_with_same_name = persons.find(person => person.name === newName)
    const persons_with_same_name = persons.filter(person => person.name === newName)

    if (persons_with_same_name.length !== 0) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const personObject = {
          name: newName,
          number:newNumber,
          id: persons_with_same_name[0].id
        }
        personService
          .update(personObject.id, personObject)
            .then((returnedPerson) => {
              const update_person = persons.filter(item => item.id !== returnedPerson.id).concat(returnedPerson)
              //console.log("returnedPerson", returnedPerson)
              setPersons(update_person)
              setNotification(
                {message:`Added ${newName}`,type:"fufilled"}
              )
              setNewName('')
              setNewNumber('')
              setTimeout(() => {
                setNotification({message:null,type:null})
              }, 5000)})
            .catch(error => {
              console.log("catch error")
              setNotification(
                {message:`Information of ${newName} has already been removed from server`,
                type:"error"}
              )
              setPersons(persons.filter(n => n.name !== newName))
              setTimeout(() => {
                setNotification({message:null,type:null})
              }, 5000)
            })
            
        return
      } else return} 
    
    const personObject = {
      name: newName,
      number:newNumber,
      id: persons.length + 1
    }

    personService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotification(
            {message:`Added ${newName}`,type:"fufilled"}
          )
          setNewName('')
          setNewNumber('')
          setTimeout(() => {
            setNotification({message:null,type:null})
          }, 5000)
        })
    }
  
  const delete_a_person = (person) => {
    return (
      () => {
        if (window.confirm(`Delete ${person.name} ?`)){
          personService.delete_person(person.id).then(
            setPersons(persons.filter(item => item.id !== person.id))
        )
      }}
    )
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    //console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterNameChange = (event) => {
    //console.log(event.target.value)
    setNewFilterName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification = {notification} />
      <Filter persons = {persons} newFilterName = {newFilterName} handleFilterNameChange = {handleFilterNameChange} delete_a_person = {delete_a_person}/>
      <h2>add a new</h2>
      <PersonForm addName = {addName} newName = {newName} newNumber = {newNumber} 
      handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons = {persons} delete_a_person = {delete_a_person}/>
    </div>
  )
}

export default App
