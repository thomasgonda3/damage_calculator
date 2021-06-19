import './app.css'

import { Generations, Pokemon } from '@smogon/calc'
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
      battleType: 'singles',
      allEffects: {
        terrain: 'none',
        weather: 'none',
        auraBreak: false,
        fairyAura: false,
        darkAura: false,
        gravity: false
      },
      p1Effects: {
        protect: false,
        stealthRock: false,
        spikes: 0,
        reflect: false,
        lightScreen: false,
        auroraVeil: false,
        foresight: false,
        helpingHand: false,
        battery: false,
        friendGuard: false,
        tailWind: false
      },
      p2Effects: {
        protect: false,
        stealthRock: false,
        spikes: 0,
        reflect: false,
        lightScreen: false,
        auroraVeil: false,
        foresight: false,
        helpingHand: false,
        battery: false,
        friendGuard: false,
        tailWind: false
      },
      pokemon1: new Pokemon(gen, 'Abomasnow', {
        item: 'Life Orb',
        nature: 'Modest',
        evs: { spa: 252 },
        boosts: { spa: 1 }
      }),
      pokemon2: new Pokemon(gen, 'Abomasnow', {
        item: 'Leftovers',
        nature: 'Adamant',
        evs: { spa: 252 },
        boosts: { spa: 1 }
      })
    }
  }

  async componentDidMount() {
    Object.assign(document.body.style, body)
  }

  handleChange(state) {
    console.log('going off', state)
    this.setState({ ...this.state, ...state })
  }

  render() {
    console.log('main', this.state.pokemon1)
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
          <FieldInfo />
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
