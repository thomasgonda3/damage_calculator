import { calculate, Generations, Pokemon } from '@smogon/calc'
import React, { Component } from 'react'

export const body = {
  margin: 0,
  padding: 0,
  height: '100%'
}

export const row = {
  width: '100%',
  height: '100%',
  display: 'table',
  tableLayout: 'fixed'
}

export const column = {
  minHeight: '100%',
  display: 'table-cell'
}

const gen = Generations.get(8)

class DamageCalc extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playersMove: 1,
      moveIndex: 0
    }
  }

  async componentDidMount() {}

  handleChange(state) {
    this.setState({ ...this.state, ...state })
  }

  render() {
    const { pokemon1, pokemon2 } = this.props
    const p1Name =
      typeof pokemon1.species === 'string'
        ? pokemon1.species
        : pokemon1.species.name
    const p2Name =
      typeof pokemon2.species === 'string'
        ? pokemon2.species
        : pokemon2.species.name
    const p1 = new Pokemon(gen, p1Name, {
      nature: pokemon1.nature,
      level: pokemon1.level,
      item: pokemon1.item,
      ability: pokemon1.ability
    })

    if (pokemon1.base != null) {
      p1.evs = pokemon1.evs
      p1.ivs = pokemon1.ivs
      p1.boosts = pokemon1.boosts
      p1.species.baseStats = pokemon1.base
      p1.types = [pokemon1.type1]
      if (pokemon1.type2 !== '') p1.types.push(pokemon1.type2)
    }

    const p2 = new Pokemon(gen, p2Name, {
      nature: pokemon2.nature,
      level: pokemon2.level,
      item: pokemon2.item,
      ability: pokemon2.ability
    })

    if (pokemon2.base != null) {
      p2.evs = pokemon2.evs
      p2.ivs = pokemon2.ivs
      p2.boosts = pokemon2.boosts
      p2.species.baseStats = pokemon2.base
      p2.types = [pokemon2.type1]
      if (pokemon2.type2 !== '') p2.types.push(pokemon2.type2)
    }

    const pokemon1Moves = pokemon1.moves.map(move => {
      move.overrides = {
        basePower: move.bp,
        type: move.type,
        category: move.category
      }
      return calculate(gen, p1, p2, move)
    })
    const pokemon1MovesHTML = pokemon1Moves.map((move, index) => {
      if (move.damage === 0) move.damage = [0, 0]
      const backgroundColor = index % 2 === 0 ? '#bebebe' : 'white'
      const fontWeight =
        this.state.playersMove === 1 && this.state.moveIndex === index
          ? 'bold'
          : 'normal'
      return (
        <li
          key={index}
          style={{
            height: '18px',
            width: '100%',
            display: 'inline-flex',
            padding: '9px',
            backgroundColor,
            cursor: 'pointer'
          }}
          onClick={() =>
            this.setState({
              currentCalc: move,
              playersMove: 1,
              moveIndex: index
            })
          }
        >
          <div style={{ width: '64%', textAlign: 'center', fontWeight }}>
            {move.move.name}
          </div>
          <div style={{ float: 'left', fontWeight }}>
            {Math.floor((1000 * move.damage[0]) / move.defender.stats.hp) / 10}-
            {Math.floor(
              (1000 * move.damage[move.damage.length - 1]) /
                move.defender.stats.hp
            ) / 10}
            %
          </div>
        </li>
      )
    })

    const pokemon2Moves = pokemon2.moves.map(move =>
      calculate(gen, p2, p1, move)
    )
    const pokemon2MovesHTML = pokemon2Moves.map((move, index) => {
      if (move.damage === 0) move.damage = [0, 0]
      const backgroundColor = index % 2 === 0 ? '#bebebe' : 'white'
      const fontWeight =
        this.state.playersMove === 2 && this.state.moveIndex === index
          ? 'bold'
          : 'normal'
      return (
        <li
          key={index}
          style={{
            height: '18px',
            width: '100%',
            display: 'inline-flex',
            padding: '9px',
            backgroundColor,
            cursor: 'pointer'
          }}
          onClick={() =>
            this.setState({
              currentCalc: move,
              playersMove: 2,
              moveIndex: index
            })
          }
        >
          <div style={{ width: '64%', textAlign: 'center', fontWeight }}>
            {move.move.name}
          </div>
          <div style={{ float: 'left', fontWeight }}>
            {Math.floor((1000 * move.damage[0]) / move.defender.stats.hp) / 10}-
            {Math.floor(
              (1000 * move.damage[move.damage.length - 1]) /
                move.defender.stats.hp
            ) / 10}
            %
          </div>
        </li>
      )
    })

    const { playersMove, moveIndex } = this.state
    const currentCalc =
      playersMove === 1 ? pokemon1Moves[moveIndex] : pokemon2Moves[moveIndex]
    const description =
      pokemon1Moves[0] != null
        ? `${currentCalc.rawDesc.attackEVs} ${
            currentCalc.rawDesc.attackerName
          } ${currentCalc.rawDesc.moveName} vs. ${
            currentCalc.rawDesc.HPEVs
          } / ${currentCalc.rawDesc.defenseEVs} ${
            currentCalc.rawDesc.defenderName
          }: ${currentCalc.damage[0]}-${
            currentCalc.damage[currentCalc.damage.length - 1]
          } (${Math.floor(
            (1000 * currentCalc.damage[0]) / currentCalc.defender.stats.hp
          ) / 10} - ${Math.floor(
            (1000 * currentCalc.damage[currentCalc.damage.length - 1]) /
              currentCalc.defender.stats.hp
          ) / 10}%)`
        : ''

    const possibleDamage =
      pokemon1Moves[0] != null
        ? Array.isArray(currentCalc.damage)
          ? `Possible damage amounts: (${currentCalc.damage.join(', ')})`
          : typeof currentCalc.damage === 'number'
          ? `Possible damage amount: (${currentCalc.damage})`
          : ''
        : ''

    return (
      <>
        <div style={{ display: 'table', tableLayout: 'fixed', width: '100%' }}>
          <div
            style={{
              minHeight: '100%',
              width: '50%',
              float: 'left',
              display: 'tableCell'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ul style={{ width: '17em', listStyle: 'none' }}>
                {pokemon1MovesHTML}
              </ul>
            </div>
          </div>
          <div
            style={{
              minHeight: '100%',
              width: '50%',
              float: 'left',
              display: 'tableCell'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ul style={{ width: '17em', listStyle: 'none' }}>
                {pokemon2MovesHTML}
              </ul>
            </div>
          </div>
        </div>
        <div
          style={{
            fontSize: 'large',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '5px'
          }}
        >
          {description}
        </div>
        <div
          style={{
            textAlign: 'center',
            marginBottom: '15px'
          }}
        >
          {possibleDamage}
        </div>
      </>
    )
  }
}
export default DamageCalc
