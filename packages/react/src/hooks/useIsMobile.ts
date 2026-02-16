import useBreakpoint from "./useBreakpoint";

const useIsMobile = (): boolean => {
  const { isBelow } = useBreakpoint();
  return isBelow("s");
};

export default useIsMobile;
