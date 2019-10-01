import { Type } from '@angular/core';



export class SpyObject {
  constructor(type?: any) {
    if (type) {
      // NOTE!! Difference from Angular implementation: Using getOwnPropertyNames because functions
      // on transpiled classes are not enumerable.
      for (const prop of Object.getOwnPropertyNames(type.prototype)) {
        let m: any;
        try {
          m = type.prototype[prop];
        } catch (e) {
          // As we are creating spys for abstract classes, these classes might have getters that
          // throw when they are accessed. As we are only auto creating spys for methods, this
          // should not matter.
        }
        if (typeof m === 'function') {
          this.spy(prop);
        }
      }
    }
  }

 //todo:removed typr

  static create<T>(type: Type<T>): any {
    // SpyObj doesn't exactly match SpyObject, so TS wouldn't let us directly assert the type, but
    // it's close enough for our purposes. So, we assert through any to get the usefulness.
    return (new SpyObject(type) as any) as any;
  }

  static stub(object: any, config: any, overrides: any) {
    if (!(object instanceof SpyObject)) {
      overrides = config;
      config = object;
      object = new SpyObject();
    }

    const m = { ...config, ...overrides };
    Object.keys(m).forEach(key => {
      object.spy(key).and.returnValue(m[key]);
    });
    return object;
  }

  spy(name: string) {
    if (!(this as any)[name]) {
      (this as any)[name] = jasmine.createSpy(name);
    }
    return (this as any)[name];
  }

  prop(name: string, value: any) {
    (this as any)[name] = value;
  }
}
