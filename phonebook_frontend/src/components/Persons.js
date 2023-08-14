const Person = ({person, delete_a_person}) => {
    return <li>{person.name} {person.number} <button onClick = {delete_a_person(person)}>delete</button></li>
}

const Persons = ({persons, delete_a_person}) => {
    return (
      <div>{persons.map(person => <Person key = {person.id + "_numbers"} person = {person} delete_a_person = {delete_a_person}/>)}</div>
    )
}

const Filter = ({persons, newFilterName, handleFilterNameChange, delete_a_person}) => {
    let filter_name_lower = newFilterName.toLowerCase()
    // {}.concat error; [].concat OK
    let filter_persons = []
  
    if (filter_name_lower.length !== 0) {
      for (const person of persons) {
        if (person.name.slice(0, filter_name_lower.length).toLowerCase() === filter_name_lower) {
          //console.log(person)
          filter_persons = filter_persons.concat(person)
        }
      }
    }
    return (
      <>
      <div>filter shown with: <input value = {newFilterName} onChange={handleFilterNameChange}/></div>
      <div>{filter_persons.map(person => <Person key = {person.id + "_filter"} person = {person} delete_a_person = {delete_a_person}/>)}</div>
      </>
    )
}

// export default can only export one var
export {Persons, Filter}