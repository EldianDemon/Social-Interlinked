import { NavLink } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth, setFetching } from '../../reducers/authReducer'

const Navbar = () => {

    const dispatch = useDispatch()

    const isFetching = useSelector(state => state.auth.isFetching)
    const isAuth = useSelector(state => state.auth.isAuth)

    const fetchData = useCallback(async () => {
        try {
            dispatch(setFetching(true))
            await dispatch(checkAuth())
        } catch (err) {
            console.log('Error while fetching data:', err)
        } finally {
            dispatch(setFetching(false))
        }

    }, dispatch)

    useEffect(() => {
        fetchData()
    }, [])


    if (isFetching) return (
        <div>
            Skeleton Placeholder
        </div>
    )

    return (
        <div>
            <ul>
                <li><NavLink to='/signup'>signup</NavLink></li>
                {isAuth &&
                    <li>
                        <NavLink>
                            Брюс Ли
                        </NavLink>
                    </li>
                }
            </ul>
        </div>
    )
}

export default Navbar