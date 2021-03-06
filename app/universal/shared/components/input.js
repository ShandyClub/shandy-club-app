import styled from 'styled-components'
import Atomic from '../style/atomic'

import { colours } from '../style'

export const Input = styled.input`
  width: ${ props => props.width || 'auto' };
  border-bottom: 2px solid ${ colours.dark };
  border-radius: 0;
  text-overflow: ellipsis;
  outline: none;

  ${ ({ atomic }) => Atomic({ ...Input.default.atomic, ...atomic }) }
`

Input.default = {
  atomic: {
    d: 'ib',
  },
}
