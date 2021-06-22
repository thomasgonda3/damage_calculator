import { Field } from '@smogon/calc'
import React, { Component } from 'react'

const buttonStyle = {
  height: '25px',
  fontSize: '14px',
  borderRadius: '9px',
  marginRight: '5px',
  marginTop: '5px',
  cursor: 'pointer',
  width: 'fit-content'
}

const activeStyle = {
  ...buttonStyle,
  backgroundColor: 'white',
  fontWeight: 'bold'
}

const field = new Field()

const terrains = ['None', 'Electric', 'Grassy', 'Psychic', 'Misty']
const weather = [
  'None',
  'Sand',
  'Sun',
  'Rain',
  'Hail',
  'Harsh Sunshine',
  'Heavy Rain',
  'Strong Winds'
]
const fieldEffects = {
  isSR: 'Stealth Rocks',
  steelsurge: 'Steelsurge',
  isReflect: 'Reflect',
  isLightScreen: 'Light Screen',
  isProtected: 'Protect',
  isSeeded: 'Leech Seed',
  isForesight: 'Foresight',
  isHelpingHand: 'Helping Hand',
  isTailwind: 'Tailwind',
  isAuroraVeil: 'Aurora Veil',
  isBattery: 'Battery',
  vinelash: 'Vinelash',
  wildfire: 'Wildfire',
  cannonade: 'Cannonade',
  volcalith: 'Volcalith'
}

class FieldInfo extends Component {
  constructor(props) {
    super(props)
    this.state = new Field()
  }

  async componentDidMount() {}

  handleChange(state) {
    const newState = { ...this.state, ...state }
    Object.setPrototypeOf(newState, field)
    this.setState(newState)
    this.props.handleFieldChange({ field: newState })
  }

  render() {
    const terrainButtons = terrains.map((terrain, index) => {
      const currStyle =
        this.state.terrain === terrain ||
        (this.state.terrain === undefined && terrain === 'None')
          ? activeStyle
          : buttonStyle
      const terrainState = terrain === 'None' ? undefined : terrain
      const terrainText = terrain === 'None' ? 'None' : `${terrain} Terrain`
      return (
        <button
          key={index}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              terrain: terrainState
            })
          }
        >
          {terrainText}
        </button>
      )
    })

    const weatherButtons = weather.map((weather, index) => {
      const currStyle =
        this.state.weather === weather ||
        (this.state.weather === undefined && weather === 'None')
          ? activeStyle
          : buttonStyle
      const weatherState = weather === 'None' ? undefined : weather
      const weatherText = weather === 'None' ? 'None' : weather
      return (
        <button
          key={index}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              weather: weatherState
            })
          }
        >
          {weatherText}
        </button>
      )
    })

    const gravityStyle =
      this.state.isGravity === true ? activeStyle : buttonStyle
    const gravityButton = (
      <button
        style={gravityStyle}
        onClick={() =>
          this.handleChange({
            isGravity: !this.state.isGravity
          })
        }
      >
        Gravity
      </button>
    )

    const attackersFieldButtons = []
    const defendersFieldButtons = []

    for (const effect in fieldEffects) {
      const effectName = fieldEffects[effect]
      const attackerEffectStyle =
        this.state.attackerSide[effect] === true ? activeStyle : buttonStyle
      const defenderEffectStyle =
        this.state.defenderSide[effect] === true ? activeStyle : buttonStyle
      attackersFieldButtons.push(
        <button
          style={attackerEffectStyle}
          onClick={() =>
            this.handleChange({
              attackerSide: {
                ...this.state.attackerSide,
                [effect]: !this.state.attackerSide[effect]
              }
            })
          }
        >
          {effectName}
        </button>
      )
      defendersFieldButtons.push(
        <div style={{ textAlign: 'right' }}>
          <button
            style={defenderEffectStyle}
            onClick={() =>
              this.handleChange({
                defenderSide: {
                  ...this.state.defenderSide,
                  [effect]: !this.state.defenderSide[effect]
                }
              })
            }
          >
            {effectName}
          </button>
        </div>
      )
    }

    const attackerSpikeButtons = [0, 1, 2, 3].map(number => {
      const currStyle =
        this.state.attackerSide.spikes === number ? activeStyle : buttonStyle
      return (
        <button
          key={number}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              attackerSide: {
                ...this.state.attackerSide,
                spikes: number
              }
            })
          }
        >
          {number}
        </button>
      )
    })

    attackersFieldButtons.unshift(
      <div>
        <span>Spikes: </span>
        <div style={{ display: 'inline-flex' }}>{attackerSpikeButtons}</div>
      </div>
    )

    const defenderSpikeButtons = [0, 1, 2, 3].map(number => {
      const currStyle =
        this.state.defenderSide.spikes === number ? activeStyle : buttonStyle
      return (
        <button
          key={number}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              defenderSide: {
                ...this.state.defenderSide,
                spikes: number
              }
            })
          }
        >
          {number}
        </button>
      )
    })

    defendersFieldButtons.unshift(
      <div style={{ textAlign: 'right' }}>
        <span>Spikes: </span>
        <div style={{ display: 'inline-flex' }}>{defenderSpikeButtons}</div>
      </div>
    )

    const attackerSwitchingButtons = [
      ['N/A', undefined],
      ['In', 'in'],
      ['Out', 'out']
    ].map((array, index) => {
      const buttonText = array[0]
      const buttonsState = array[1]
      const currStyle =
        this.state.attackerSide.isSwitching === buttonsState
          ? activeStyle
          : buttonStyle
      return (
        <button
          key={index}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              attackerSide: {
                ...this.state.attackerSide,
                isSwitching: buttonsState
              }
            })
          }
        >
          {buttonText}
        </button>
      )
    })

    attackersFieldButtons.push(
      <div>
        <span>Switching: </span>
        <div style={{ display: 'inline-flex' }}>{attackerSwitchingButtons}</div>
      </div>
    )

    const defenderSwitchingButtons = [
      ['N/A', undefined],
      ['In', 'in'],
      ['Out', 'out']
    ].map((array, index) => {
      const buttonText = array[0]
      const buttonsState = array[1]
      const currStyle =
        this.state.defenderSide.isSwitching === buttonsState
          ? activeStyle
          : buttonStyle
      return (
        <button
          key={index}
          style={currStyle}
          onClick={() =>
            this.handleChange({
              defenderSide: {
                ...this.state.defenderSide,
                isSwitching: buttonsState
              }
            })
          }
        >
          {buttonText}
        </button>
      )
    })

    defendersFieldButtons.push(
      <div style={{ textAlign: 'right' }}>
        <span>Switching: </span>
        <div style={{ display: 'inline-flex' }}>{defenderSwitchingButtons}</div>
      </div>
    )

    return (
      <div className="card" style={{ width: '25em', marginRight: '5px' }}>
        <div
          className="card-body"
          style={{
            height: '735px',
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
            Field
          </h5>
          <div
            style={{
              display: 'flex',
              flexFlow: 'wrap',
              justifyContent: 'center'
            }}
          >
            {terrainButtons}
          </div>
          <div
            style={{
              display: 'flex',
              flexFlow: 'wrap',
              justifyContent: 'center',
              marginTop: '10px'
            }}
          >
            {weatherButtons}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px'
            }}
          >
            {gravityButton}
          </div>
          <div style={{ display: 'inline-flex', width: '100%' }}>
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                marginTop: '10px'
              }}
            >
              {attackersFieldButtons}
            </div>
            <div
              style={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                margin: '10 0 auto auto'
              }}
            >
              {defendersFieldButtons}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default FieldInfo
