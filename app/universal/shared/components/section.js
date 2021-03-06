import styled from 'styled-components'
import Atomic from '../style/atomic'

import { colours } from '../style'

export const Section = styled.section`
  width: ${ props => props.width || Section.default.width };
  max-width: ${ props => props.maxWidth || Section.default.maxWidth };
  min-width: ${ props => props.minWidth || Section.default.minWidth };
  height: ${ props => props.height || Section.default.height };
  margin: ${ props => props.margin || Section.default.margin };
  background-color: ${ props => props.backgroundColor && colours[props.backgroundColor] || Section.default.backgroundColor };

  ${ ({ atomic }) => Atomic({ ...atomic }) }
`

Section.default = {
  width: 'auto',
  maxWidth: 'auto',
  minWidth: 'auto',
  height: 'auto',
  margin: 'auto',
  backgroundColor: 'transparent',
}
