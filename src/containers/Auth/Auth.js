import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch
} from 'react-router-dom'
import SignUp from '../SignUp/SignUp'
import LogIn from '../LogIn/LogIn'
import ForgotPassword from '../ForgotPassword/ForgotPassword'
import CreateStore from '../CreateStore/CreateStore'


const Auth = props => {

  let { path } = useRouteMatch()

  return(

    <Router>

      <Switch>

        <Route
          path={`${path}/signup`} exact render={ (props) => <SignUp {...props} /> }
        />

        <Route
          path={`${path}/re-auth`} exact render={ (props) => <SignUp reAuth={'reAuth'} {...props} /> }
        />

        <Route
          path={`${path}/login`} exact render={ (props) => <LogIn {...props} /> }
        />

        <Route
          path={`${path}/forgot-password`} exact render={ (props) => <ForgotPassword {...props} /> }
        />

        <Route
          path={`${path}/create-store`} exact render={ (props) => <CreateStore {...props} /> }
        />

      </Switch>

    </Router>

  )

}

export default Auth
