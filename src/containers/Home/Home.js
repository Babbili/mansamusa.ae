import React, { useContext, useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import AppContext from '../../components/AppContext'
import { firestore } from '../../firebase/config'
import { colors } from '../../components/utils/colors'
import { toSlug } from '../../components/utils/toSlug'
import Banners from '../../components/Banners/Banners'
import Slider from '../../components/Slider/Slider'
import ProductItem from '../../components/ProductItem/ProductItem'
import BasicSpinner from '../../components/UI/BasicSpinner/BasicSpinner'
import Banner from '../../components/Banners/Banner/Banner'
import SuppliersPromo from '../../components/SuppliersPromo/SuppliersPromo'
import styles from './Home.module.scss'
import ProductItemAddToFavourites from '../../components/ProductItem/ProductItemAddToFavourites/ProductItemAddToFavourites'
import ProductItemHeader from '../../components/ProductItem/ProductItemHeader/ProductItemHeader'
import ProductItemBody from '../../components/ProductItem/ProductItemBody/ProductItemBody'


const Home = props => {

  const context = useContext(AppContext)
  const { t } = useTranslation()
  let { lang, isMobile } = context

  // const [fashion, setFashion] = useState([])
  const [homeNArt, setHomeNArt] = useState([])
  const [beauty, setBeauty] = useState([])
  const [banners, setBanners] = useState([])
  const [menFashion, setMenFashion] = useState([])
  const [womenFashion, setWomenFashion] = useState([])

  //let productUrl = '/details' + toSlug(product.productName) + '-' + product.id

  useEffect(() => {

    return firestore.collection('products')
    .where('categoryPicker.categorySelectors', 'array-contains', 'Fashion')
    .where('isApproved', '==', true)
    .where('isBlocked', '==', false)
    .where('status.en', '==', 'Active')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .onSnapshot(snapshot => {
      let products = []
      snapshot.forEach(doc => {
        if (doc.data().categoryPicker.categorySelectors.includes('Men')) {
          products = [...products, {id: doc.id, ...doc.data()}]
        }
      })
      setMenFashion(products)
    })

  }, [])

  useEffect(() => {

    return firestore.collection('products')
    .where('categoryPicker.categorySelectors', 'array-contains', 'Fashion')
    .where('isApproved', '==', true)
    .where('isBlocked', '==', false)
    .where('status.en', '==', 'Active')
    .orderBy('createdAt', 'desc')
    .limit(4)
    .onSnapshot(snapshot => {
      let products = []
      snapshot.forEach(doc => {
        if (doc.data().categoryPicker.categorySelectors.includes('Women')) {
          products = [...products, {id: doc.id, ...doc.data()}]
        }
      })
      setWomenFashion(products)
    })

  }, [])

  useEffect(() => {

    return firestore.collection('productTypes')
    .where('isHome', '==', true)
    .onSnapshot(snapshot => {
      let banners = []
      snapshot.forEach(doc => {
        banners = [...banners, {...doc.data()}]
      })
      setBanners(banners)
    })

  }, [])


  useEffect(() => {

    return firestore.collection('products')
    .where('categoryPicker.categorySelectors', 'array-contains-any', ['Home N Art'])
    .where('isApproved', '==', true)
    .where('isBlocked', '==', false)
    .where('status.en', '==', 'Active')
    .orderBy('createdAt', 'desc')
    .limit(10)
    .onSnapshot(snapshot => {
      let products = []
      snapshot.forEach(doc => {
        products = [...products, {id: doc.id, ...doc.data()}]
      })
      setHomeNArt(products)
    })

  }, [])

  useEffect(() => {

    return firestore.collection('products')
    .where('categoryPicker.categorySelectors', 'array-contains-any', ['Beauty'])
    .where('isApproved', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .onSnapshot(snapshot => {
      let products = []
      snapshot.forEach(doc => {
        products = [...products, {id: doc.id, ...doc.data()}]
      })
      setBeauty(products)
    })

  }, [])


  const [currentSlide, setCurrentSlide] = useState(0)
  const slide = useRef()

  function slideLeft() {
    console.log('currentSlide'+ currentSlide)
    if(currentSlide == 0) {
      setCurrentSlide(3)
    } else {
      setCurrentSlide( currentSlide -1)
    }
  }
  function slideRight() {
    if(currentSlide == 3) {
      setCurrentSlide(0)
    } else {
      setCurrentSlide( currentSlide +1)
    }
  }

  const [isDragging, setIsDragging] = useState(false)
  const [startPosition, setStartPosition] = useState(0)
  const [endPosition, setEndPosition] = useState(0)

  function touchStart(event) {
    setIsDragging(true)
    setStartPosition(event.type.includes('mouse') ? event.pageX : event.touches[0].clientX)
  }
  function touchEnd() {
    setIsDragging(false)
  }
  function touchMove(event) {
    if(isDragging == true) {
      setEndPosition(event.type.includes('mouse') ? event.pageX : event.touches[0].clientX)
      slideDirectionCheck()
    }
  }
  function slideDirectionCheck() {
    console.log(endPosition - startPosition )
    // let movePosition = endPosition - startPosition
    // slide.current.style.transform = `translateX(${movePosition}px)`
    //endPosition - startPosition < -100 ? slideRight() : 
    //endPosition - startPosition > 100 ? slideLeft() : console.log(`mini ${endPosition} - ${startPosition}` )
  }

  return(

    <>

      {/*<SuppliersPromo {...props} />*/}

      {
        context.currentUser !== null &&
        context.currentUser.type === 'supplier' &&
        context.currentUser.completed === false ?
          <Redirect
            to={{
              pathname: "/create-store"
            }}
          /> : null
      }


    <main className={styles.home+` bd__container`}>

      <div className={styles.home__icons}>

        <a className={styles.home__icon__container} href="/categories/fashion">
          <div className={styles.home__icon}>
            <svg
   xmlns="http://www.w3.org/2000/svg"
   width="500"
   height="500"
   viewBox="0 0 500 500">
  <g
     transform="matrix(0.96258728,0,0,0.96195598,3.319852,4)"
     id="g6">
    <g
       id="g845">
      <path
         fill="#e79427"
         d="M 222.5,511.32959 C 162.83888,508.42373 108.52328,500.55701 54.644201,487.01845 27.954644,480.31199 16.821504,476.89846 17.346115,475.58251 17.583467,474.98713 55.62769,416.52083 101.88883,345.6574 L 186,216.81481 185.9731,197.6574 185.94621,178.5 181.8543,176 C 161.47766,163.55065 156.04264,147.48315 156.01736,99.618493 L 156,66.736986 l 7.5,0.48132 7.5,0.481321 V 33.849814 0 h 15 15 v 37.879146 37.879146 l 8.25,4.637241 c 17.07537,9.597895 29.98054,21.457217 40.42029,37.144607 6.77497,10.18047 5.73749,10.11613 11.82971,0.73364 10.06373,-15.49893 27.3888,-31.185738 43.25,-39.160262 L 311,75.97121 V 37.985605 0 h 15 15 V 33.5 67 h 7.5 7.5 v 33.45078 c 0,47.52762 -4.63742,61.19538 -25.6742,75.66907 l -4.3258,2.97623 0.0163,18.70196 0.0163,18.70196 84.49504,129.46582 c 46.47228,71.20619 84.34403,129.91888 84.15945,130.47262 -0.85293,2.55879 -63.06646,17.67154 -96.68719,23.48701 -56.36537,9.74967 -121.95827,14.01195 -175.5,11.40414 z"
         id="path851" />
      <path
         fill="#f2a22b"
         d="M 256,364.60842 V 217 h -35 -35 v -19.01342 -19.01342 l 3.75,1.63368 c 12.48844,5.44057 14.48216,5.74036 41,6.16519 L 256,187.17655 V 156.96948 126.7624 l 5.669,-8.1312 C 274.72718,99.901479 288.99908,87.177293 306.25,78.88479 L 311,76.601469 V 38.300734 0 h 15 15 v 34.041701 34.0417 l 7.57931,-0.686819 7.5793,-0.686818 -0.39738,35.395116 c -0.44044,39.23063 -0.52636,39.83703 -7.54754,53.2709 -3.81215,7.29391 -13.82716,18.33874 -19.10244,21.06669 L 326,178.05136 v 19.58327 19.58327 l 84.25,129.05646 c 46.3375,70.98105 84.37627,129.36084 84.5306,129.73286 0.35221,0.849 -32.24303,9.82865 -52.61908,14.49602 C 387.73822,502.9695 336.42769,509.4251 274.75,511.566 L 256,512.21684 Z M 193.5,73.484054 c -3.3,-1.256532 -9.7125,-3.074811 -14.25,-4.04062 L 171,67.687417 V 33.843709 0 h 15 15 v 38 c 0,20.9 -0.3375,37.947948 -0.75,37.884329 -0.4125,-0.06362 -3.45,-1.143743 -6.75,-2.400275 z"
         id="path849" />
      <path
         fill="#d75439"
         d="m 186,197.98658 v -19.01342 l 3.75,1.63368 c 13.8115,6.01695 11.78458,5.81933 63.31067,6.17266 51.6587,0.35424 56.1719,0.008 67.51758,-5.18669 L 326,179.11065 V 198.05532 217 h -70 -70 z"
         id="path847" />
    </g>
  </g>
            </svg>
          </div>
          <h4>{t('Fashion.lable')}</h4>
        </a>

        <a className={styles.home__icon__container} href="/categories/beauty">
          <div className={styles.home__icon}>
            <svg
   xmlns="http://www.w3.org/2000/svg"
   width="500"
   height="500"
   viewBox="0 0 500 500">
  <g
     transform="matrix(0.79940779,0,0,0.8982559,30.240923,3.9441085)"
     id="g1454">
    <g
       id="g1426">
      <path
         fill="#fa8a73"
         d="m 160.53332,544.62145 c -3.97515,-1.77435 -8.56646,-6.59012 -10.06547,-10.55759 -0.76942,-2.03643 -1.13453,-32.42916 -1.13453,-94.44064 v -91.43788 l 2.4,-4.6969 c 4.00475,-7.83745 9.82045,-10.61065 22.36155,-10.66301 l 6.09489,-0.0254 0.33403,-121.86666 c 0.39538,-144.24553 0.81457,-148.415134 17.9354,-178.397743 33.01788,-57.822113 122.78252,-32.73035261 158.78565,44.385095 8.61795,18.458866 7.96861,7.626183 8.34673,139.244078 l 0.33755,117.4981 9.83542,0.36856 c 22.43232,0.84062 21.14462,-5.80611 20.79173,107.32086 l -0.28963,92.85051 -3.27584,4.0986 c -6.74824,8.4431 2.63878,7.83346 -119.92415,7.78851 -88.97461,-0.0326 -109.92919,-0.30606 -112.53333,-1.46844 z"
         id="path1436" />
      <path
         fill="#f2a22b"
         d="m 160.23748,544.37231 c -11.32797,-5.618 -10.9952,-2.2681 -10.66077,-107.31813 l 0.28995,-91.07824 2.61791,-3.82006 c 4.14902,-6.05426 7.82971,-7.68448 18.71542,-8.28923 l 9.6,-0.53334 0.56146,-124.26666 C 181.9765,72.940525 181.71079,78.643075 188.43744,57.201537 198.37835,25.514366 217.91209,4.1885986 239.46665,1.4909258 l 5.33334,-0.66749627 -6.61757,3.38033837 C 209.46705,18.871937 219.47425,68.225701 259.10527,107.39167 c 40.15083,39.67966 91.36331,47.99224 103.53951,16.80605 2.05127,-5.25378 2.05552,-5.04887 2.10531,101.66893 l 0.0499,106.93333 -64.8,0.24898 -64.79999,0.24897 74.8558,0.55103 c 84.07561,0.61889 77.42085,-0.0654 83.29434,8.56513 l 2.41682,3.5513 -0.28349,94.48396 -0.28348,94.48395 -2.4841,3.48276 c -5.48606,7.69159 3.10096,7.15546 -119.1159,7.43694 -99.60212,0.22939 -110.19326,0.0911 -113.3625,-1.48069 z M 246.75554,0.35555553 c 0.39111,-0.39111108 1.03111,-0.39111108 1.42223,0 0.3911,0.39111109 0.0711,0.71111107 -0.71112,0.71111107 -0.78222,0 -1.10222,-0.31999998 -0.71111,-0.71111107 z"
         id="path1434" />
      <path
         fill="#e79427"
         d="m 161.79604,544.5879 c -12.10746,-4.31807 -11.39605,2.26112 -11.39605,-105.39139 v -93.28104 l 2.4,-3.52634 c 4.54175,-6.67321 7.36485,-7.95044 18.47566,-8.35878 l 10.05767,-0.36963 2.2e-4,-120.69703 c 1.9e-4,-115.223998 0.096,-121.284036 2.11238,-133.642312 C 190.6275,35.30623 212.54151,4.8607563 239.46665,1.4909258 l 5.33334,-0.66749627 -6.61757,3.38033837 C 209.46705,18.871937 219.47425,68.225701 259.10527,107.39167 c 40.15083,39.67966 91.36331,47.99224 103.53951,16.80605 2.05127,-5.25378 2.05552,-5.04887 2.10531,101.66893 l 0.0499,106.93333 H 300.7575 c -90.23021,0 -79.94561,-13.79074 -79.94561,107.19999 0,101.88475 -0.31818,98.83615 10.89227,104.36168 4.8523,2.39167 -63.21875,2.61197 -69.90811,0.22625 z M 246.75554,0.35555553 c 0.39111,-0.39111108 1.03111,-0.39111108 1.42223,0 0.3911,0.39111109 0.0711,0.71111107 -0.71112,0.71111107 -0.78222,0 -1.10222,-0.31999998 -0.71111,-0.71111107 z"
         id="path1432" />
      <path
         fill="#eb6849"
         d="M 181.33354,212.53332 C 181.33373,97.738255 181.42983,91.677709 183.44592,79.321378 190.6275,35.30623 212.54151,4.8607563 239.46665,1.4909258 l 5.33334,-0.66749627 -6.61757,3.38033837 C 209.46705,18.871937 219.47425,68.225701 259.10527,107.39167 c 40.15083,39.67966 91.36331,47.99224 103.53951,16.80605 2.05127,-5.25378 2.05552,-5.04887 2.10531,101.66893 l 0.0499,106.93333 h -91.73333 -91.73333 z m 65.422,-212.17776447 c 0.39111,-0.39111108 1.03111,-0.39111108 1.42223,0 0.3911,0.39111109 0.0711,0.71111107 -0.71112,0.71111107 -0.78222,0 -1.10222,-0.31999998 -0.71111,-0.71111107 z"
         id="path1430" />
      <path
         fill="#d75439"
         d="m 181.33332,213.73688 c 0,-129.272138 0.009,-129.503932 5.99334,-151.767416 8.5457,-31.793352 24.4888,-52.1228789 46.11902,-58.8077296 8.63294,-2.66802326 10.37662,-2.59720587 4.95431,0.2012124 -21.06353,10.8707342 -23.18617,38.9975822 -5.32612,70.5756972 l 4.71621,8.338648 -0.99545,7.661351 c -0.56195,4.325036 -1.00978,58.873027 -1.02837,125.261347 l -0.0329,117.59999 h -27.2 -27.2 z"
         id="path1428" />
    </g>
  </g>
            </svg>
          </div>
          <h4>{t('Beauty.lable')}</h4>
        </a>

        <a className={styles.home__icon__container} href="/categories/home-n-art">
          <div className={styles.home__icon}>
            <svg
   xmlns="http://www.w3.org/2000/svg"
   width="500"
   height="500"
   viewBox="0 0 500 500">
  <g
     transform="matrix(1,0,0,0.95954941,-6,4)"
     id="g861">
    <g
       id="g2011">
      <path
         fill="#f2a220"
         d="m 162.01986,509.75 c -2.42216,-1.2375 -5.78001,-3.97774 -7.46189,-6.08941 L 151.5,499.82117 151.18254,483.39854 c -0.54317,-28.0993 0.73617,-30.42536 31.26086,-56.83805 L 204.01861,407.89169 203.7593,358.19585 203.5,308.5 136.5,308 c -66.592323,-0.49696 -67.018254,-0.5131 -70,-2.65223 -10.326754,-7.40853 -10.500684,-8.19672 -10.496262,-47.56565 0.0044,-38.94981 -0.459516,-37.09159 10.9185,-43.7367 C 115.27397,185.80649 151.49957,119.31779 167.46971,29.5 170.72009,11.21948 172.84239,6.9929245 180.87963,2.7942216 L 186.22838,0 255.86419,0.021962 c 77.15489,0.0243334 73.72948,-0.25505581 80.47866,6.5641311 4.25943,4.3036099 5.40341,7.1722549 7.12386,17.8638439 8.32977,51.764727 27.90986,105.888633 50.55321,139.740813 15.71101,23.48821 28.81544,35.99259 54.57379,52.07486 7.29387,4.55394 7.40918,5.2158 7.38433,42.38552 -0.0247,36.94783 -0.16739,37.79589 -7.43215,44.17443 C 442.85322,307.82379 441.72788,308 415.49928,308 h -24.37051 l -0.31439,24.25 c -0.39065,30.13278 -2.53933,35.09402 -15.19214,35.07817 -12.94894,-0.0162 -15.04383,-4.77887 -15.43676,-35.09492 L 359.87095,307.9665 334.18548,308.23325 308.5,308.5 l -0.25927,49.64244 -0.25928,49.64244 20.31211,17.50099 c 31.70026,27.31305 31.939,27.69926 32.50823,52.58758 0.44708,19.54806 0.0615,22.07377 -4.09254,26.80491 -6.7943,7.73829 -0.40105,7.27506 -100.74736,7.29968 l -89.53811,0.022 -4.40392,-2.25 z"
         id="path2021" />
      <path
         fill="#e79427"
         d="m 162.01986,509.75 c -2.42216,-1.2375 -5.78001,-3.97774 -7.46189,-6.08941 L 151.5,499.82117 151.18254,483.39854 c -0.54314,-28.09784 0.73737,-30.4264 31.25156,-56.83 L 204,407.90779 V 357.9539 308 h 26 26 V 268.5 229 H 156 C 87.925392,229 56,228.67049 56,227.96788 56,222.62604 59.44036,219.1393 74,209.72522 118.93854,180.66852 154.93328,109.93958 169.02652,23 172.48259,1.6799077 176.42061,0 222.94282,0 H 256 V 114.5 229 h 100 100 l -0.006,30.25 c -0.009,48.17382 -0.44106,48.6915 -40.68004,48.72804 l -24.18561,0.022 -0.31439,24.25 c -0.39065,30.13278 -2.53933,35.09402 -15.19214,35.07817 -12.94708,-0.0162 -15.04384,-4.7809 -15.43662,-35.07817 L 359.87123,308 H 333.93562 308 v 49.90043 49.90043 l 20.30283,17.493 c 31.68971,27.30396 31.92976,27.69234 32.49896,52.57959 0.44708,19.54806 0.0615,22.07377 -4.09254,26.80491 -6.7943,7.73829 -0.40105,7.27506 -100.74736,7.29968 l -89.53811,0.022 -4.40392,-2.25 z"
         id="path2019" />
      <path
         fill="#e79427"
         d="m 162.01986,509.75 c -2.42216,-1.2375 -5.78001,-3.97774 -7.46189,-6.08941 L 151.5,499.82117 151.18254,483.39854 c -0.54314,-28.09784 0.73737,-30.4264 31.25156,-56.83 L 204,407.90779 V 357.9539 308 h 26 26 V 268.5 229 h 100 100 l -0.006,30.25 c -0.009,48.17382 -0.44106,48.6915 -40.68004,48.72804 l -24.18561,0.022 -0.31439,24.25 c -0.39065,30.13278 -2.53933,35.09402 -15.19214,35.07817 -12.94708,-0.0162 -15.04384,-4.7809 -15.43662,-35.07817 L 359.87123,308 H 333.93562 308 v 49.90043 49.90043 l 20.30283,17.493 c 31.68971,27.30396 31.92976,27.69234 32.49896,52.57959 0.44708,19.54806 0.0615,22.07377 -4.09254,26.80491 -6.7943,7.73829 -0.40105,7.27506 -100.74736,7.29968 l -89.53811,0.022 -4.40392,-2.25 z"
         id="path2017" />
      <path
         fill="#eb6849"
         d="m 162.01986,509.75 c -2.42216,-1.2375 -5.78001,-3.97774 -7.46189,-6.08941 L 151.5,499.82117 151.18254,483.39854 c -0.54314,-28.09784 0.73737,-30.4264 31.25156,-56.83 L 204,407.90779 V 357.9539 308 h 52 52 v 49.90043 49.90043 l 20.30283,17.493 c 31.68971,27.30396 31.92976,27.69234 32.49896,52.57959 0.44708,19.54806 0.0615,22.07377 -4.09254,26.80491 -6.7943,7.73829 -0.40105,7.27506 -100.74736,7.29968 L 166.42378,512 Z M 370.5,366.50668 c -9.26532,-3.3093 -10.61719,-8.0728 -10.2697,-36.18669 L 360.5,308.5 h 15 15 v 24 c 0,22.33762 -0.14098,24.23998 -2.03538,27.46462 -3.66309,6.23527 -11.16985,8.96896 -17.96462,6.54206 z"
         id="path2015" />
      <path
         fill="#d75439"
         d="M 256,410.03853 V 308 h 26 26 l 0.0112,50.25 0.0112,50.25 21.23879,18.23647 c 30.23341,25.9596 31.11673,27.49831 31.1905,54.33236 0.0854,31.07705 1.52026,30.33252 -59.20171,30.7197 l -45.25,0.28853 V 410.03853 Z m 111.89788,-45.30846 c -6.45899,-4.31489 -6.89459,-6.39804 -6.89633,-32.98007 L 361,308 h 14.5 14.5 l -0.004,24.25 c -0.003,22.43377 -0.15256,24.4941 -1.99086,27.50914 -4.32118,7.0873 -13.53121,9.36418 -20.10752,4.97093 z"
         id="path2013" />
    </g>
  </g>
            </svg>
          </div>
          <h4>{t('HomeNart.lable')}</h4>
        </a>

      </div>


      <a className={styles.home__slider__header} href='/categories/fashion' >
          <h3>{t('newInFashion.label')}</h3>
          <div className={styles.home__slider__header__arrow}>
            <span>{t('viewAll.label')}</span>
            { lang !== 'ar' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
            }
          </div>
      </a>
      <section className={styles.home__products}>
              
        {
          womenFashion.length > 0 ?
            womenFashion.map((product, index) => (
              <ProductItem
                key={index}
                lang={lang}
                product={product}
              />
            )) :
            <div className='row my-5 py-5'>
              <div className='col-12 my-5 py-5'>
                <BasicSpinner />
              </div>
            </div>
        }
        
      </section>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--container-color-light)', width: '100vw', height: 'auto', padding: 'var(--mb-1-5)', zIndex: '1' }} >
      <section className={styles.home__slider}>

        <a className={styles.home__slider__header} href='/categories/home-n-art' >
          <h3>{t('newInHomeNArt.label')}</h3>
          <div className={styles.home__slider__header__arrow}>
            <span>{t('viewAll.label')}</span>
            { lang !== 'ar' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
            }
          </div>
        </a>

        <div className={styles.home__slider__left__arrow} onClick={() => slideLeft()} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm2.707 14.293-1.414 1.414L7.586 12l5.707-5.707 1.414 1.414L10.414 12l4.293 4.293z"></path></svg>
        </div>
        
        <div className={styles.home__slides__wrapper}>
          <div className={styles.home__slides+` home__slides__transform${currentSlide}`} >
            { homeNArt.length > 0 ?
            homeNArt.map( (product, index) => { 
              
              return(
              <div key={index} className={ currentSlide == index  ? 'home__slide': 'hide__slide' } ref={slide}
              onTouchStart={(event) => touchStart(event)}
              onTouchEnd={() => touchEnd()}
              onTouchMove={(event) => touchMove(event)}

              onMouseDown={(event) => touchStart(event)}
              onMouseUp={() => touchEnd()}
              onMouseLeave={() => touchEnd()}
              onMouseMove={(event) => touchMove(event)}
               >

                <img src={product.productImages.length > 0 ? product.productImages[0].url : 'noImage'} onDragStart={(e) => e.preventDefault()} onClick={() => window.location=`/details${toSlug(product.productName)}-${product.id}` } style={{ cursor: 'pointer' }} />
                <div className={styles.productDetails}>
                  <ProductItemHeader
                    supplier
                    lang={lang}
                    url={'/details' + toSlug(product.productName) + '-' + product.id}
                    product={product}
                  />
                  <ProductItemBody
                    lang={lang}
                    supplier
                    product={product}
                  />
                </div>
              </div>
              )
            }) : 
            <></>
            }
          </div>
        </div>
        
        <div className={styles.home__slider__right__arrow} onClick={() => slideRight()} >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.293 15.707-1.414-1.414L13.586 12 9.293 7.707l1.414-1.414L16.414 12l-5.707 5.707z"></path></svg>
        </div>

      </section>
      </div>

      <a className={styles.home__slider__header} href='/categories/beauty' >
          <h3>{t('newInBeauty.label')}</h3>
          <div className={styles.home__slider__header__arrow}>
            <span>{t('viewAll.label')}</span>
            { lang !== 'ar' ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M10.061 19.061 17.121 12l-7.06-7.061-2.122 2.122L12.879 12l-4.94 4.939z"></path></svg>
              :
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--title-color)"><path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path></svg>
            }
          </div>
      </a>
      <section className={styles.home__products}>
        
        {
          beauty.length > 0 ?
            beauty.map((product, index) => (
              <ProductItem
                key={index}
                lang={lang}
                product={product}
              />
            )) :
            <div className='row my-5 py-5'>
              <div className='col-12 my-5 py-5'>
                <BasicSpinner />
              </div>
            </div>
        }
        
      </section>
    


      {
        menFashion.length > 0 ?
          <Slider
            link={'/'}
            lang={lang}
            isArrows={true}
            isHeader={true}
            isPaddings={true}
            isMobile={isMobile}
            url={'/categories/fashion/men'}
            title={'New Men Fashion'}
            length={menFashion.length}
            bgColor={colors.primary}
          >
            {
              menFashion.length > 0 ?
                menFashion.map((product, index) => (
                  <ProductItem
                    key={index}
                    lang={lang}
                    product={product}
                  />
                )) :
                <div className='row my-5 py-5'>
                  <div className='col-12 my-5 py-5'>
                    <BasicSpinner />
                  </div>
                </div>
            }
          </Slider> : null
      }



     

    </main>

    </>

  )

}

export default Home
