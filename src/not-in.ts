import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";

export function NotIn(property:string, validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: 'NotIn',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatePropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatePropertyName];
                    return typeof value === 'string' && typeof relatedValue === 'string' && !relatedValue.includes(value);
                }
            }
        })
    }
}