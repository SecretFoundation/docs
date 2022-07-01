# Contract optimization

Optimizing your code is especially important on blockchain due to the fact that inefficient code costs your users money and can jam up the entire network. With any function you make, try to complete it in as few steps as possible and avoid unnecessary computation. One of the most costly actions you can make is loading and saving data, thus you should ensure you are only saving  what is needed. Aside from this, there are a few other tips we can provide.

## Avoid Vector and Arrays

When dealing with large sets of data, vectors and arrays can be especially problematic because in order to save load a single item within them, you must effectively load the entire vector and all of its contents, which naturally can amount to an enormous amount of inefficiency when you only need one item! There are several ways around this: CashMaps, AppendStore, or even deconstructing vectors into a set of data keyed to a counter variable. Research each options pros and cons, and choose which one is best for your particular contract.
