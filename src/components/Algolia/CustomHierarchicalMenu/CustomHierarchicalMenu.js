import React from 'react'
import { connectHierarchicalMenu } from 'react-instantsearch-dom'
import HierarchicalMenuList from './HierarchicalMenuList/HierarchicalMenuList'


const CustomHierarchicalMenu = ({ items, currentRefinement, refine, createURL }) => {


  return(

    <HierarchicalMenuList items={items} refine={refine} createURL={createURL} />

  )

}

export default connectHierarchicalMenu(CustomHierarchicalMenu)
