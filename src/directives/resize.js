import { useElementSize } from "@vueuse/core";
import { debouncedWatch } from "@vueuse/core";
const resize = (el, binding) => {
    const { width } = useElementSize(el);
    const { value } = binding;
    debouncedWatch(
        width,
        () => {
            value && value.resize();
        },
        { debounce: 500 }
    );
};
export default resize;
