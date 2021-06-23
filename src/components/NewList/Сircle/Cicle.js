
import classes from './Cicle.module.scss'

export const Cicle = ({ colors, selectedColor, onClickHandler }) => (
   colors.map(item => (
      <li
         key={item.id}
         style={{ backgroundColor: item.hex }}
         className={[classes.cicle, selectedColor === item.id && classes.active].join(' ')}
         onClick={() => onClickHandler(item.id)}
      >

      </li>
   ))
)