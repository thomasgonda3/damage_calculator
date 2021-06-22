import { Generations, Move, Pokemon } from '@smogon/calc'
import { ABILITIES } from '@smogon/calc/src/data/abilities'
import { ITEMS } from '@smogon/calc/src/data/items'
import { MOVES } from '@smogon/calc/src/data/moves'
import { NATURES } from '@smogon/calc/src/data/natures'
import { SPECIES } from '@smogon/calc/src/data/species'
import { TYPE_CHART } from '@smogon/calc/src/data/types'
import React, { Component } from 'react'

const fetch = require('node-fetch')

const inputStyle = {
  width: '3em',
  marginRight: '2px'
}

const tableStyle = {
  marginLeft: '18px',
  marginBottom: '15px'
}

const pokeList = Object.keys(SPECIES[8])
  .sort()
  .map((x, index) => (
    <option value={x} key={index}>
      {x}
    </option>
  ))
const typeList = Object.keys(TYPE_CHART[8]).map((x, index) => (
  <option value={x} key={index}>
    {x}
  </option>
))
const abilityList = ABILITIES[8].map((x, index) => (
  <option value={x} key={index}>
    {x}
  </option>
))
const itemList = ITEMS[8].sort().map((x, index) => (
  <option value={x} key={index}>
    {x}
  </option>
))
const moveList = Object.keys(MOVES[8])
  .sort()
  .map((x, index) => (
    <option value={x} key={index}>
      {x}
    </option>
  ))

const battleStages = (
  <>
    <option value="6">+6</option>
    <option value="5">+5</option>
    <option value="4">+4</option>
    <option value="3">+3</option>
    <option value="2">+2</option>
    <option value="1">+1</option>
    <option value="0">--</option>
    <option value="-1">-1</option>
    <option value="-2">-2</option>
    <option value="-3">-3</option>
    <option value="-4">-4</option>
    <option value="-5">-5</option>
    <option value="-6">-6</option>
  </>
)

const gen = Generations.get(8)

export const calcHP = (base, ev, iv, level) => {
  if (base === 1) return 1
  return (
    Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) +
    level +
    10
  )
}

export const calcStat = (base, ev, iv, level, statName, nature) => {
  const raw =
    Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level) / 100) + 5
  const boostsArray = NATURES[nature]
  if (
    boostsArray[0] === boostsArray[1] ||
    (boostsArray[0] !== statName && boostsArray[1] !== statName)
  )
    return raw
  return Math.floor(boostsArray[0] === statName ? 1.1 * raw : 0.9 * raw)
}

const checkInput = (input, min, max) => {
  if (isNaN(input) || input <= min) return min
  if (input >= max) return max
  return input
}

// TODO: make state a new Pokemon object + extra info
// figure out what that extra info is
class PokemonInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      species: 'Abomasnow',
      type1: 'Grass',
      type2: 'Ice',
      forme: 'Abomasnow',
      level: 50,
      base: {
        hp: 90,
        atk: 92,
        def: 75,
        spa: 92,
        spd: 85,
        spe: 60
      },
      ivs: {
        hp: 31,
        atk: 31,
        def: 31,
        spa: 31,
        spd: 31,
        spe: 31
      },
      evs: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      boosts: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      currentHP: 165,
      nature: 'Bashful',
      ability: 'Snow Warning',
      weight: 135.5,
      item: 'Abomasite',
      status: 'Healthy',
      moves: ['Blizzard', 'Leaf Storm', 'Earth Power', 'Focus Blast']
    }
  }

  async componentDidMount() {
    await this.getNewPokemon('swampert')
  }

  async getNewPokemon(species) {
    const newPoke = {
      species: species[0].toUpperCase() + species.substring(1),
      forme: species,
      level: 50,
      status: 'Healthy',
      item: '',
      nature: 'Bashful',
      evs: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      boosts: {
        hp: 0,
        atk: 0,
        def: 0,
        spa: 0,
        spd: 0,
        spe: 0
      },
      moves: []
    }

    let response
    let usageData = {}
    // fetch current usage stats of pokmon species
    try {
      try {
        console.log('Trying Gen 8 Usage Stats')
        const params = ['gen8ou', species]
        const uri = `https://smogon-usage-stats.herokuapp.com/`
        const query = params
          .map(param => {
            if (param !== '') return `${param}`
            return ''
          })
          .join('/')
        response = await fetch(`http://localhost:8000/proxy?uri=${uri + query}`)
        usageData = await response.json()
        if (usageData.error === 404)
          throw new Error('Could not find usage data for swampert in gen8ou')
      } catch {
        console.log('Trying Gen 7 Usage Stats')
        const params = ['gen7ou', species]
        const uri = `https://smogon-usage-stats.herokuapp.com/`
        const query = params
          .map(param => {
            if (param !== '') return `${param}`
            return ''
          })
          .join('/')
        response = await fetch(`http://localhost:8000/proxy?uri=${uri + query}`)
        usageData = await response.json()
      }
    } catch (e) {
      console.log('Failed to find Usage Stats')
      console.log(e)
    }

    // set params based on usage stats
    if (usageData.error == null) {
      newPoke.item = Object.keys(usageData.items)[0]
      const popNature = Object.keys(usageData.spreads)[0]
      newPoke.nature = popNature
      const popEvs = Object.keys(usageData.spreads[popNature])[0].split('/')
      const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
      let i = 0
      for (const stat in evs) {
        evs[stat] = popEvs[i]
        i++
      }
      newPoke.evs = evs
      const moveNames = Object.keys(usageData.moves)
      moveNames.pop()
      newPoke.moves = moveNames
        .map(x => {
          return new Move(gen, x)
        })
        .filter(x => x.category === 'Physical' || x.category === 'Special')
    }

    // set params based on pokemon's characteristics
    const realPoke = new Pokemon(gen, species, {
      item: newPoke.item,
      nature: newPoke.nature,
      evs: newPoke.evs,
      level: newPoke.level
    })

    newPoke.ability =
      usageData.error == null
        ? Object.keys(usageData.abilities)[0]
        : realPoke.ability
    newPoke.ivs = realPoke.ivs
    newPoke.base = realPoke.species.baseStats
    newPoke.currentHP = realPoke.rawStats.hp
    newPoke.weight = realPoke.species.weightkg
    newPoke.type1 = realPoke.types[0]
    newPoke.type2 = realPoke.types.length > 1 ? realPoke.types[1] : ''

    this.setState({ ...newPoke })
    this.props.handlePokemonChange({ [this.props.stateName]: newPoke })
  }

  handleChange(state) {
    const newState = { ...this.state, ...state }
    this.setState(newState)
    this.props.handlePokemonChange({ [this.props.stateName]: newState })
  }

  handleMoveChange(state, index) {
    const newState = this.state
    const moveName = Object.values(state)[0]
    const newMove = new Move(gen, moveName)
    newState.moves[index] = newMove
    this.setState(newState)
    this.props.handlePokemonChange({ [this.props.stateName]: newState })
  }

  handleMoveFieldChange(value, field, index) {
    const newState = this.state
    newState.moves[index][field] = !isNaN(value) ? +value : value
    this.setState(newState)
    this.props.handlePokemonChange({ [this.props.stateName]: newState })
  }

  render() {
    const hp = calcHP(
      +this.state.base.hp,
      +this.state.evs.hp,
      +this.state.ivs.hp,
      +this.state.level
    )
    const atk = calcStat(
      +this.state.base.atk,
      +this.state.evs.atk,
      +this.state.ivs.atk,
      +this.state.level,
      'atk',
      this.state.nature
    )
    const def = calcStat(
      +this.state.base.def,
      +this.state.evs.def,
      +this.state.ivs.def,
      +this.state.level,
      'def',
      this.state.nature
    )
    const spa = calcStat(
      +this.state.base.spa,
      +this.state.evs.spa,
      +this.state.ivs.spa,
      +this.state.level,
      'spa',
      this.state.nature
    )
    const spd = calcStat(
      +this.state.base.spd,
      +this.state.evs.spd,
      +this.state.ivs.spd,
      +this.state.level,
      'spd',
      this.state.nature
    )
    const spe = calcStat(
      +this.state.base.spe,
      +this.state.evs.spe,
      +this.state.ivs.spe,
      +this.state.level,
      'spe',
      this.state.nature
    )
    const moveArray = this.state.moves.map((x, index) => {
      return (
        <div key={index} style={{ marginTop: '2px' }}>
          <select
            className="form-select"
            style={{ width: '140px', marginRight: '5px' }}
            aria-label="Default select example"
            onChange={({ target: { value: moves } }) =>
              this.handleMoveChange({ moves }, index)
            }
            value={this.state.moves[index].name}
          >
            {moveList}
          </select>
          <input
            className="form-select"
            style={{ width: '3em', marginRight: '5px' }}
            aria-label="Default select example"
            onInput={e =>
              (e.target.value = checkInput(e.target.value, 0, 65535))
            }
            onChange={({ target: { value } }) =>
              this.handleMoveFieldChange(value, 'bp', index)
            }
            value={this.state.moves[index].bp}
          />
          <select
            className="form-select"
            style={{ marginRight: '5px' }}
            aria-label="Default select example"
            onChange={({ target: { value } }) =>
              this.handleMoveFieldChange(value, 'type', index)
            }
            value={this.state.moves[index].type}
          >
            {typeList}
          </select>
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={({ target: { value } }) =>
              this.handleMoveFieldChange(value, 'category', index)
            }
            value={this.state.moves[index].category}
          >
            <option value="Physical">Physical</option>
            <option value="Special">Special</option>
          </select>
        </div>
      )
    })
    return (
      <div className="card" style={{ width: '25em', marginRight: '5px' }}>
        <div
          className="card-body"
          style={{
            backgroundColor: '#f1f4f9',
            border: '1px solid #aaa',
            padding: '20px'
          }}
        >
          <h5
            className="card-header"
            style={{
              margin: '0 auto',
              textAlign: 'center',
              fontSize: 'large',
              marginBottom: '6px'
            }}
          >
            {this.props.label}
          </h5>
          <select
            className="form-select"
            style={{
              width: '100%',
              height: '28px',
              textSize: '24px',
              marginBottom: '10px'
            }}
            aria-label="Default select example"
            onChange={e => this.getNewPokemon(e.target.value)}
            value={this.state.species}
          >
            {pokeList}
          </select>
          <div style={{ marginBottom: '2.5px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>Type</span>
            <select
              className="form-select"
              style={{ marginRight: '5px' }}
              aria-label="Default select example"
              onChange={({ target: { value: type1 } }) =>
                this.handleChange({ type1 })
              }
              value={this.state.type1}
            >
              {typeList}
            </select>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={({ target: { value: type2 } }) =>
                this.handleChange({ type2 })
              }
              value={this.state.type2}
            >
              {typeList}
            </select>
          </div>
          <div style={{ marginBottom: '2.5px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>Level</span>
            <input
              className="form-select"
              style={inputStyle}
              aria-label="Default select example"
              onInput={e =>
                (e.target.value = checkInput(e.target.value, 1, 100))
              }
              onChange={({ target: { value: level } }) =>
                this.handleChange({ level })
              }
              value={this.state.level}
            />
          </div>
          <table className="table table-bordered" style={tableStyle}>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Base</th>
                <th scope="col">IVs</th>
                <th scope="col">EVs</th>
                <th scope="col">Raw</th>
                <th scope="col" />
                <th scope="col">Real</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">HP</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: hp } }) =>
                      this.handleChange({
                        base: { ...this.state.base, hp: +hp }
                      })
                    }
                    value={this.state.base.hp}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: hp } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, hp: +hp }
                      })
                    }
                    value={this.state.ivs.hp}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: hp } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, hp: +hp }
                      })
                    }
                    value={this.state.evs.hp}
                  />
                </td>
                <td>{hp}</td>
              </tr>
              <tr>
                <th scope="row">Attack</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: atk } }) =>
                      this.handleChange({
                        base: { ...this.state.base, atk: +atk }
                      })
                    }
                    value={this.state.base.atk}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: atk } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, atk: +atk }
                      })
                    }
                    value={this.state.ivs.atk}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: atk } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, atk: +atk }
                      })
                    }
                    value={this.state.evs.atk}
                  />
                </td>
                <td>{atk}</td>
                <td>
                  <select
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onChange={({ target: { value: atk } }) =>
                      this.handleChange({
                        boosts: { ...this.state.boosts, atk: +atk }
                      })
                    }
                    value={this.state.boosts.atk}
                  >
                    {battleStages}
                  </select>
                </td>
                <td>
                  {Math.floor(
                    atk *
                      (+this.state.boosts.atk >= 0
                        ? (2 + +this.state.boosts.atk) / 2
                        : 2 / (2 - +this.state.boosts.atk))
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Defense</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: def } }) =>
                      this.handleChange({
                        base: { ...this.state.base, def: +def }
                      })
                    }
                    value={this.state.base.def}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: def } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, def: +def }
                      })
                    }
                    value={this.state.ivs.def}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: def } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, def: +def }
                      })
                    }
                    value={this.state.evs.def}
                  />
                </td>
                <td>{def}</td>
                <td>
                  <select
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onChange={({ target: { value: def } }) =>
                      this.handleChange({
                        boosts: { ...this.state.boosts, def: +def }
                      })
                    }
                    value={this.state.boosts.def}
                  >
                    {battleStages}
                  </select>
                </td>
                <td>
                  {Math.floor(
                    def *
                      (+this.state.boosts.def >= 0
                        ? (2 + +this.state.boosts.def) / 2
                        : 2 / (2 - +this.state.boosts.def))
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Sp. Atk</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: spa } }) =>
                      this.handleChange({
                        base: { ...this.state.base, spa: +spa }
                      })
                    }
                    value={this.state.base.spa}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: spa } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, spa: +spa }
                      })
                    }
                    value={this.state.ivs.spa}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: spa } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, spa: +spa }
                      })
                    }
                    value={this.state.evs.spa}
                  />
                </td>
                <td>{spa}</td>
                <td>
                  <select
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onChange={({ target: { value: spa } }) =>
                      this.handleChange({
                        boosts: { ...this.state.boosts, spa: +spa }
                      })
                    }
                    value={this.state.boosts.spa}
                  >
                    {battleStages}
                  </select>
                </td>
                <td>
                  {Math.floor(
                    spa *
                      (+this.state.boosts.spa >= 0
                        ? (2 + +this.state.boosts.spa) / 2
                        : 2 / (2 - +this.state.boosts.spa))
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Sp. Def</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: spd } }) =>
                      this.handleChange({
                        base: { ...this.state.base, spd: +spd }
                      })
                    }
                    value={this.state.base.spd}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: spd } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, spd: +spd }
                      })
                    }
                    value={this.state.ivs.spd}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: spd } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, spd: +spd }
                      })
                    }
                    value={this.state.evs.spd}
                  />
                </td>
                <td>{spd}</td>
                <td>
                  <select
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onChange={({ target: { value: spd } }) =>
                      this.handleChange({
                        boosts: { ...this.state.boosts, spd: +spd }
                      })
                    }
                    value={this.state.boosts.spd}
                  >
                    {battleStages}
                  </select>
                </td>
                <td>
                  {Math.floor(
                    spd *
                      (+this.state.boosts.spd >= 0
                        ? (2 + +this.state.boosts.spd) / 2
                        : 2 / (2 - +this.state.boosts.spd))
                  )}
                </td>
              </tr>
              <tr>
                <th scope="row">Speed</th>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 1, 255))
                    }
                    onChange={({ target: { value: spe } }) =>
                      this.handleChange({
                        base: { ...this.state.base, spe: +spe }
                      })
                    }
                    value={this.state.base.spe}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 31))
                    }
                    onChange={({ target: { value: spe } }) =>
                      this.handleChange({
                        ivs: { ...this.state.ivs, spe: +spe }
                      })
                    }
                    value={this.state.ivs.spe}
                  />
                </td>
                <td>
                  <input
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onInput={e =>
                      (e.target.value = checkInput(e.target.value, 0, 252))
                    }
                    onChange={({ target: { value: spe } }) =>
                      this.handleChange({
                        evs: { ...this.state.evs, spe: +spe }
                      })
                    }
                    value={this.state.evs.spe}
                  />
                </td>
                <td>{spe}</td>
                <td>
                  <select
                    className="form-select"
                    style={inputStyle}
                    aria-label="Default select example"
                    onChange={({ target: { value: spe } }) =>
                      this.handleChange({
                        boosts: { ...this.state.boosts, spe: +spe }
                      })
                    }
                    value={this.state.boosts.spe}
                  >
                    {battleStages}
                  </select>
                </td>
                <td>
                  {Math.floor(
                    spe *
                      (+this.state.boosts.spe >= 0
                        ? (2 + +this.state.boosts.spe) / 2
                        : 2 / (2 - +this.state.boosts.spe))
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div style={{ marginBottom: '2.5px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>
              Nature
            </span>
            <select
              className="form-select"
              onChange={({ target: { value: nature } }) =>
                this.handleChange({ nature })
              }
              value={this.state.nature}
            >
              <option value="Adamant">Adamant (+Atk, -SpA)</option>
              <option value="Bashful">Bashful</option>
              <option value="Bold">Bold (+Def, -Atk)</option>
              <option value="Brave">Brave (+Atk, -Spe)</option>
              <option value="Calm">Calm (+SpD, -Atk)</option>
              <option value="Careful">Careful (+SpD, -SpA)</option>
              <option value="Docile">Docile</option>
              <option value="Gentle">Gentle (+SpD, -Def)</option>
              <option value="Hardy" selected="selected">
                Hardy
              </option>
              <option value="Hasty">Hasty (+Spe, -Def)</option>
              <option value="Impish">Impish (+Def, -SpA)</option>
              <option value="Jolly">Jolly (+Spe, -SpA)</option>
              <option value="Lax">Lax (+Def, -SpD)</option>
              <option value="Lonely">Lonely (+Atk, -Def)</option>
              <option value="Mild">Mild (+SpA, -Def)</option>
              <option value="Modest">Modest (+SpA, -Atk)</option>
              <option value="Naive">Naive (+Spe, -SpD)</option>
              <option value="Naughty">Naughty (+Atk, -SpD)</option>
              <option value="Quiet">Quiet (+SpA, -Spe)</option>
              <option value="Quirky">Quirky</option>
              <option value="Rash">Rash (+SpA, -SpD)</option>
              <option value="Relaxed">Relaxed (+Def, -Spe)</option>
              <option value="Sassy">Sassy (+SpD, -Spe)</option>
              <option value="Serious">Serious</option>
              <option value="Timid">Timid (+Spe, -Atk)</option>
            </select>
          </div>
          <div style={{ marginBottom: '2.5px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>
              Ability
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={({ target: { value: ability } }) =>
                this.handleChange({ ability })
              }
              value={this.state.ability}
            >
              {abilityList}
            </select>
          </div>
          <div style={{ marginBottom: '2.5px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>Item</span>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={({ target: { value: item } }) =>
                this.handleChange({ item })
              }
              value={this.state.item}
            >
              {itemList}
            </select>
          </div>
          <div style={{ marginBottom: '4px' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>
              Status
            </span>
            <select
              className="form-select"
              aria-label="Default select example"
              onChange={({ target: { value: status } }) =>
                this.handleChange({ status })
              }
              value={this.state.status}
            >
              <option value="Healthy">Healthy</option>
              <option value="Poisoned">Poisoned</option>
              <option value="Badly Poisoned">Badly Poisoned</option>
              <option value="Burned">Burned</option>
              <option value="Paralyzed">Paralyzed</option>
              <option value="Asleep">Asleep</option>
              <option value="Frozen">Frozen</option>
            </select>
          </div>
          <div style={{ marginBottom: '.6em' }}>
            <span style={{ width: '6em', display: 'inline-block' }}>
              Current HP
            </span>
            <input
              className="form-select"
              style={inputStyle}
              aria-label="Default select example"
              onInput={e =>
                (e.target.value = checkInput(
                  e.target.value,
                  0,
                  this.state.raw.hp
                ))
              }
              onChange={({ target: { value: currentHP } }) =>
                this.handleChange({ currentHP: +currentHP })
              }
              value={this.state.currentHP}
            />
            <span>
              /
              {calcHP(
                +this.state.base.hp,
                +this.state.evs.hp,
                +this.state.ivs.hp,
                +this.state.level
              )}
            </span>
          </div>
          <div>{moveArray}</div>
        </div>
      </div>
    )
  }
}
export default PokemonInfo
