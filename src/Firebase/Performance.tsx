import React from 'react'
import * as App from './App'
import 'firebase/performance'

export const Performance = () => {
    return <App.Consumer>{app => {
        app.performance();
        return <></>
    }}</App.Consumer>
}