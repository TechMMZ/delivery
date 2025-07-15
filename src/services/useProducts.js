import { useMemo } from 'react';
import useComida from './useComida';
import useTecnologia from './useTecnologia';
import useFarmacia from './useFarmacia';
import useMascota from './useMascota';

const useProducts = () => {
    const { comida } = useComida();
    const { tecnologia } = useTecnologia();
    const { farmacia } = useFarmacia();
    const { mascota } = useMascota();

    return useMemo(
        () => [...comida, ...tecnologia, ...farmacia, ...mascota],
        [comida, tecnologia, farmacia, mascota]
    );
};

export default useProducts;
