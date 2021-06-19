import { Field, Generations } from '@smogon/calc'
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

class FieldInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {}

  handleChange(state) {
    this.setState({ ...this.state, ...state })
  }

  render() {
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
            Field
          </h5>
          <p>
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum."
          </p>
        </div>
      </div>
    )
  }
}
export default FieldInfo
