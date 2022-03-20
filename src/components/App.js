import React, { Component, Suspense } from 'react'
import './../i18n'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom'
import firebase, { createUserProfileDocument, firestore } from '../firebase/config'
import AppContext from './AppContext'
import User from './User/User'
import MainLayout from '../layouts/MainLayout/MainLayout'
import AuthLayout from '../layouts/AuthLayout/AuthLayout'
import Home from '../containers/Home/Home'
import SignUp from '../containers/SignUp/SignUp'
import LogIn from '../containers/LogIn/LogIn'
import ForgotPassword from '../containers/ForgotPassword/ForgotPassword'
import CreateStore from '../containers/CreateStore/CreateStore'
import Supplier from '../containers/Supplier/Supplier'
import BasicSpinner from './UI/BasicSpinner/BasicSpinner'
import Categories from '../containers/Categories/Categories'
import Category from '../containers/Category/Category'
import Product from '../containers/Product/Product'
import Action from '../containers/Action/Action'
import MainHolder from '../hoc/MainHolder'
import Admin from '../containers/Admin/Admin'
import AdminLayout from '../layouts/AdminLayout/AdminLayout'
import Cart from '../containers/Cart/Cart'
import Checkout from '../containers/Checkout/Checkout'
import { userStatus } from '../firebase/userStatus'

import Store from '../containers/Store/Store'
import WishList from "../containers/WishList/WishList";
import Customer from "../containers/Customer/Customer";
import CustomerLayout from "../layouts/CustomerLayout/CustomerLayout";
import moment from 'moment';
import Pages from '../containers/Pages/Pages';
import Contact from '../containers/Contact/Contact'


class App extends Component {

  constructor(props, context) {

    super(props, context)

    this.state = {
      lang: 'en',
      country: '',
      countries: [],
      isLang: true,
      isMobile: false,
      cart: [],
      currentUser: null,
      supplierAuth: {},
      confirmationResult: {},
      wishlist: [],
      updateAbandonedCart: (uid, cart) => {

        if (uid !== undefined) {

          let userRef = firestore.collection('users').doc(uid)
          let stores = cart.map(m => m.store)

          userRef.collection('abandonedCarts')
          .doc(uid)
          .set({
            uid,
            items: cart,
            stores,
            createdAt: moment().unix()
          }, {
            merge: true
          })
          .then(() => {})
        }

      },
      updateAbandonedWishlist: (uid, wishlist) => {

        if (uid !== undefined) {
          let userRef = firestore.collection('users').doc(uid)
          let stores = wishlist.map(m => m.store)

          userRef.collection('abandonedWishlists')
          .doc(uid)
          .set({
            uid,
            items: wishlist,
            stores,
            createdAt: moment().unix()
          }, {
            merge: true
          })
          .then(() => {})
        }

      },
      handleLanguage: (lang) => {
        if (lang === 'English') {
          localStorage.setItem('lang', JSON.stringify('en'))
          this.setState({
            lang: 'en'
          })
          document.body.style.direction = 'ltr'
        } else if (lang === 'Русский') {
          localStorage.setItem('lang', JSON.stringify('ru'))
          this.setState({
            lang: 'ru'
          })
          document.body.style.direction = 'ltr'
        } else {
          localStorage.setItem('lang', JSON.stringify('ar'))
          this.setState({
            lang: 'ar'
          })
          document.body.style.direction = 'rtl'
        }
      },
      handleSupplierAuth: (countryCode, name, phone) => {
        this.setState({
          supplierAuth: {
            countryCode,
            name,
            phone
          }
        })
      },
      handleConfirmationResult: (confirmationResult) => {
        this.setState({confirmationResult})
      },
      handleAddToCart: (cart) => {

        if (this.state.cart.length > 0) {

          if (
            this.state.cart
            .some(s => s.id === cart.id && JSON.stringify(s.options) === JSON.stringify(cart.options))
          ) {

            let localCart = this.state.cart.map(m => {
              if (m.id === cart.id && JSON.stringify(m.options) === JSON.stringify(cart.options)) {
                m.quantity = m.quantity + 1
              }
              return m
            })

            localStorage.setItem('cart', JSON.stringify(localCart))

            if (this.state.currentUser !== null) {
              this.state.updateAbandonedCart(this.state.currentUser.uid, localCart)
            }

            this.setState({
              cart: localCart
            })

          } else {
            localStorage.setItem('cart', JSON.stringify([...this.state.cart, cart]))
            if (this.state.currentUser !== null) {
              this.state.updateAbandonedCart(this.state.currentUser.uid, [...this.state.cart, cart])
            }
            this.setState({
              cart: [...this.state.cart, cart]
            })
          }

        } else {
          localStorage.setItem('cart', JSON.stringify([...this.state.cart, cart]))
          if (this.state.currentUser !== null) {
            this.state.updateAbandonedCart(this.state.currentUser.uid, [...this.state.cart, cart])
          }
          this.setState({
            cart: [...this.state.cart, cart]
          })
        }
      },
      handleEmptyCart: () => {
        if (this.state.currentUser !== null) {
          this.state.updateAbandonedCart(this.state.currentUser.uid, [])
        }
        this.setState({
          cart: []
        })
      },
      handleIncreaseQuantity: (cart) => {

        if (this.state.cart.length > 0) {

          if (
            this.state.cart
            .some(s => s.id === cart.id &&
              JSON.stringify(s.options) === JSON.stringify(cart.options))
          ) {

            let localCart = this.state.cart.map(m => {
              if (m.id === cart.id && JSON.stringify(m.options) === JSON.stringify(cart.options)) {
                m.quantity = m.quantity + 1 >= m.leftOvers ? m.leftOvers : m.quantity + 1
              }
              return m
            })

            localStorage.setItem('cart', JSON.stringify(localCart))
            if (this.state.currentUser !== null) {
              this.state.updateAbandonedCart(this.state.currentUser.uid, localCart)
            }

            this.setState({
              cart: localCart
            })

          }

        }

      },
      handleDecreaseQuantity: (cart) => {

        if (this.state.cart.length > 0) {

          if (
            this.state.cart
            .some(s => s.id === cart.id &&
              JSON.stringify(s.options) === JSON.stringify(cart.options))
          ) {

            let localCart = this.state.cart.map(m => {
              if (m.id === cart.id && JSON.stringify(m.options) === JSON.stringify(cart.options)) {
                m.quantity = m.quantity - 1 <= 0 ? 0 : m.quantity - 1
              }
              return m
            }).filter(f => f.quantity !== 0)

            localStorage.setItem('cart', JSON.stringify(localCart))
            if (this.state.currentUser !== null) {
              this.state.updateAbandonedCart(this.state.currentUser.uid, localCart)
            }

            this.setState({
              cart: localCart
            })

          }

        }

      },
      handleRemoveItem: (cart) => {

        let compare = (a, b) => {
          let result = a.map(m => {
            return b.map(f => {

              if (typeof m.value === 'object') {
                return m.value.en === f.value.en
              } else {
                return m.value === f.value
              }

            }).flat(1).some(s => s === true)
          })
          return !result.some(s => s === false)
        }

        if (this.state.cart.length > 1) {

          let localCart = this.state.cart.filter((f, i) => {
            let index
            if (cart.options !== undefined) {
              if (f.id === cart.id && compare(f.options, cart.options)) {
                index = this.state.cart.indexOf(f)
              }
            } else {
              if (f.id === cart.id) {
                index = this.state.cart.indexOf(f)
              }
            }

            return index !== i
          })

          localStorage.setItem('cart', JSON.stringify(localCart))

          if (this.state.currentUser !== null) {
            this.state.updateAbandonedCart(this.state.currentUser.uid, localCart)
          }

          this.setState({
            cart: localCart
          })

        } else {

          localStorage.removeItem('cart')
          if (this.state.currentUser !== null) {
            this.state.updateAbandonedCart(this.state.currentUser.uid, [])
          }
          this.setState({
            cart: []
          })

        }

      },
      handleAddWishlistItem: (item) => {

        let check = this.state.wishlist.some(s => s.id === item.id)
        let wishlist = []

        if (check) {
          wishlist = this.state.wishlist.filter(f => f.id !== item.id)
        } else {
          wishlist = [...this.state.wishlist, item]
        }

        localStorage.setItem('wishlist', JSON.stringify(wishlist))
        if (this.state.currentUser !== null) {
          this.state.updateAbandonedWishlist(this.state.currentUser.uid, wishlist)
        }

        this.setState({
          wishlist
        })

      },
      handleCountry: (country) => {
        this.setState({ country })
      }
    }

    this.unsubscribeFromAuth = null
    this.presence = null

    this.handleResize = this.handleResize.bind(this)

  }

  componentDidMount() {

    let lang = JSON.parse(localStorage.getItem('lang'))

    if (lang) {

      this.setState({
        lang: lang
      })

      if (lang === 'ar') {
        document.body.style.direction = 'rtl'
      } else {
        document.body.style.direction = 'ltr'
      }

    }

    let wishlist = JSON.parse(localStorage.getItem('wishlist'))

    if (wishlist) {
      this.setState({
        wishlist
      })
    }

    let cart = JSON.parse(localStorage.getItem('cart'))

    if (cart) {
      this.setState({
        cart
      })
    }

    let supplierAuth = JSON.parse(localStorage.getItem('supplierAuth'))

    if (supplierAuth) {
      this.setState({
        supplierAuth
      })
    }

    let width = window.innerWidth

    window.addEventListener('resize', this.handleResize)

    if (width <= 769) {
      this.setState({
        isMobile: true
      })
    }

    this.unsubscribeFromAuth = firebase.auth().onAuthStateChanged(async userAuth => {

      this.setState({ currentUser: userAuth })

      if (userAuth) {

        firebase.auth().currentUser.getIdTokenResult(true)
          .then(result => {
            // console.log('result', result.claims)
          })

        // check online status
        if (this.state.currentUser !== null && this.state.currentUser.uid !== undefined) {
          this.presence = userStatus(this.state.currentUser.uid, this.state.wishlist, this.state.cart)
        }

        // const ref = firebase.firestore().collection('users')

        const userRef = await createUserProfileDocument(userAuth)

        userRef.onSnapshot(snapShot => {
          this.setState({
            currentUser: {
              ...snapShot.data(),
              displayName: userAuth.displayName,
              emailVerified: userAuth.emailVerified
            }
          })
        })

        // get countries list
        firestore
          .collection('countriesList')
          .onSnapshot(snap => {
            let countries = []
            snap.forEach(doc => {
              countries = [...countries, {id: doc.id, ...doc.data()}]
            })
            this.setState({ countries, country: countries[0] })
          })

        // get profile
        // ref.doc(userAuth.uid)
        // .collection('profile')
        // .onSnapshot(snapShot => {
        //   snapShot.forEach(doc => {
        //     this.setState({
        //       currentUser: {
        //         ...this.state.currentUser,
        //         profile: {
        //           id: doc.id,
        //           ...doc.data()
        //         }
        //       }
        //     })
        //   })
        // })
        //
        // get address
        // ref.doc(userAuth.uid)
        // .collection('addresses')
        // .where('default', '==', true)
        // .onSnapshot(snapShot => {
        //   snapShot.forEach(doc => {
        //     console.log('doc', doc.id)
        //     this.setState({
        //       currentUser: {
        //         ...this.state.currentUser,
        //         address: {
        //           ...doc.data()
        //         }
        //       }
        //     })
        //   })
        // })
        //
        // // get payment method
        // ref.doc(userAuth.uid)
        // .collection('paymentMethods')
        // .where('default', '==', true)
        // .onSnapshot(snapShot => {
        //   snapShot.forEach(doc => {
        //     this.setState({
        //       currentUser: {
        //         ...this.state.currentUser,
        //         paymentMethod: {
        //           ...doc.data()
        //         }
        //       }
        //     })
        //   })
        // })
        //
        // // get current store
        // ref.doc(userAuth.uid)
        // .collection('stores')
        // .onSnapshot(snapShot => {
        //   snapShot.forEach(doc => {
        //     this.setState({
        //       currentUser: {
        //         ...this.state.currentUser,
        //         store: {id: doc.id, ...doc.data()}
        //       }
        //     })
        //   })
        // })
        //
        // // get tasks
        // ref.doc(userAuth.uid)
        // .collection('tasks')
        // .onSnapshot(snapShot => {
        //   let tasks = []
        //   snapShot.forEach(doc => {
        //     tasks = [...tasks, {id: doc.id, ...doc.data()}]
        //   })
        //   this.setState({
        //     currentUser: {
        //       ...this.state.currentUser,
        //       tasks: tasks
        //     }
        //   })
        // })

      }

    })

  }

  componentWillUnmount() {

    this.unsubscribeFromAuth()

    window.addEventListener('resize', null)

    // if (this.state.currentUser.type === 'customer') {
    //   firebase.firestore().collection('users')
    //   .doc(this.state.currentUser.uid)
    //   .onDisconnect()
    //   .update({
    //     isOnline: false
    //   })
    // }

  }

  handleResize(isMobile, event) {
    this.setState({isMobile: window.innerwidth <= 769})
  }


  render() {


    return (

      <Suspense fallback={null}>

        <AppContext.Provider value={this.state}>

          <Router>

            <Switch>

              <Route
                path='/supplier'
                render={ (props) => (
                  this.state.currentUser !== null ?
                    <>
                      <AuthLayout>
                        <Supplier {...props} />
                      </AuthLayout>
                    </> :
                    <BasicSpinner />
                )}
              />

              {
                this.state.currentUser !== null && this.state.currentUser.type === 'admin' ?
                  <Route
                    path='/admin'
                    render={ (props) => (
                      this.state.currentUser !== null ?
                        <>
                          <AdminLayout {...props} >
                            <Admin {...props} />
                          </AdminLayout>
                        </> :
                        <BasicSpinner />
                    )}
                  /> : null
              }

              <Route
                path='/customer'
                render={ (props) => (
                  this.state.currentUser !== null ?
                    <>
                      <CustomerLayout {...props} >
                        <Customer {...props} />
                      </CustomerLayout>
                    </> :
                    <BasicSpinner />
                )}
              />

              <Route>

                

                  <MainLayout>

                    <Switch>

                      <Route
                        path="/" exact render={ (props) => <Home {...props} /> }
                      />

                      <Route
                        path="/page/:name" exact render={ (props) => <Pages {...props} /> }
                      />

                      <Route
                        path="/categories" exact render={ (props) => <Categories {...props} /> }
                      />

                      <Route
                        path="/categories/:category" render={ (props) => <Category {...props} /> }
                      />

                      <Route
                        path="/details/:productId" render={ (props) => <Product {...props} /> }
                      />

                      <Route
                        path="/contact-us" render={ (props) => <Contact {...props} /> }
                      />

                      <Route
                      path="/user" render={ (props) => <User {...props} /> } 
                      />

                      <Route
                        path="/login" exact render={ (props) => <LogIn {...props} /> }
                      />

                      <Route
                        path="/signup" exact render={ (props) => <SignUp {...props} /> }
                      />

                      <Route
                        path="/forgot-password" exact render={ (props) => <ForgotPassword {...props} /> }
                      />

                      <Route
                        path="/action" exact render={ (props) => <Action {...props} /> }
                      />

                      <Route
                        path="/cart" exact render={ (props) => <Cart {...props} /> }
                      />

                      <Route
                        path="/checkout" render={ (props) => <Checkout {...props} /> }
                      />

                      <Route
                        path="/wishlist" exact render={ (props) => <WishList {...props} /> }
                      />

                      <Route
                        path="/store/:id" render={ (props) => <Store {...props} /> }
                      />

                      {
                        this.state.currentUser !== null &&
                        this.state.currentUser.type === 'supplier' &&
                        this.state.currentUser.completed === false ?
                          <Route
                            path="/create-store" exact render={ (props) => <CreateStore {...props} /> }
                          /> :
                          <Redirect to={'/'} />
                      }

                      {
                        this.state.currentUser !== null ?
                          <Route
                            path="/re-auth" exact render={ (props) => <SignUp reAuth={'reAuth'} {...props} /> }
                          /> :
                          <Redirect to={'/'} />
                      }

                    </Switch>

                  </MainLayout>

                

              </Route>

            </Switch>

          </Router>

        </AppContext.Provider>

      </Suspense>

    )

  }

}

export default App
