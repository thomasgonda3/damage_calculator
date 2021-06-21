import './app.css'

import { Field, Generations, Pokemon } from '@smogon/calc'
import React, { Component } from 'react'

import DamageCalc from './components/DamageCalc'
import FieldInfo from './components/FieldInfo'
import PokemonInfo from './components/PokemonInfo'

export const body = {
  margin: 0,
  height: '100%',
  display: 'flex',
  justifyContent: 'center'
}

const gen = Generations.get(8)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      field: new Field(),
      pokemon1: new Pokemon(gen, 'Abomasnow'),
      pokemon2: new Pokemon(gen, 'Abomasnow')
    }
  }

  async componentDidMount() {
    Object.assign(document.body.style, body)
  }

  handleChange(state) {
    this.setState({ ...this.state, ...state })
  }

  render() {
    return (
      <div style={{ width: '75em' }}>
        <div
          style={{
            textAlign: 'center',
            fontSize: 'x-large',
            fontWeight: 'bold',
            padding: '20px'
          }}
        >
          Ito's Pokémon Damage Calculator
        </div>
        <DamageCalc
          pokemon1={this.state.pokemon1}
          pokemon2={this.state.pokemon2}
        />
        <div style={{ width: '75em', display: 'inline-flex' }}>
          <PokemonInfo
            label="Pokémon 1"
            stateName="pokemon1"
            handlePokemonChange={this.handleChange.bind(this)}
          />
          <FieldInfo handleFieldChange={this.handleChange.bind(this)} />
          <PokemonInfo
            label="Pokémon 2"
            stateName="pokemon2"
            handlePokemonChange={this.handleChange.bind(this)}
          />
        </div>
        <div style={{ padding: '50px 0', fontSize: 'x-large' }}>
          Created by Thomas Gonda
        </div>
      </div>
    )
  }
}
export default App
