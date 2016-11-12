/* global userJSON */
const React = require('react')
const CircleProgressBarWithImageCenter = require('./Parts/CircleProgressBarWithImageCenter')
import axios from 'axios'
import { Link } from 'react-router'

class MyTrips extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      trips: []
    }
  }

  // Get each trip for currently loggedin user
  // pass props to DisplayTrip component
  // Dispaly each trip make clickable
  // Each trip will feed its props into a the PlanNewTrip Dashboard component

  componentWillMount () {
  }

  componentDidMount () {
    console.log(userJSON.id)
    axios.get(`/api/v1/trips/all/${userJSON.id}`).then((res) => {
      console.log(res.data)
      return this.setState({ trips: res.data })
    }).catch((err) => {
      console.log(err)
    })
  }

  componentWillUnmount () {
  }

  render () {
    return (
      <div className='container-fluid'>
        <h3>Plan for</h3>
        <hr />
        {(this.state.trips.length) ? this.state.trips.map((trip, i) => {
          return (
            <div key={i} className='col-xs-12 col-sm-12 col-md-4'>
              <Link to={`/tripDash/${trip._id}`}>
                <CircleProgressBarWithImageCenter
                  img='/images/tempLocations/Tokyo.jpeg'
                  _id={trip._id}
                  mountId={trip.to.location.replace(/[\s,]/g, '')}
                  dest={trip.to.location}
                  budget={trip.meta.budget}
                  tripDate={trip.tripDate}
                  color='#aae444'
                  strokeWidth='4' />
              </Link>
            </div>
          )
        }) : null}
      </div>
    )
  }
}

module.exports = MyTrips