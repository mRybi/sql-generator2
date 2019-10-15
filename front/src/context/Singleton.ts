export enum ConnectionType{
    '020',
    '02M',
    'M2M'
}

export class Singleton {
    private static instance: Singleton;
    private static connectionType: ConnectionType;
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() { }

    /**
     * The static method that controls the access to the singleton instance.
     *
     * This implementation let you subclass the Singleton class while keeping
     * just one instance of each subclass around.
     */
    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }

        return Singleton.instance;
    }

    public static getConnectionType(): ConnectionType {
        return Singleton.connectionType;
    }

    public static setConnectionType(type: ConnectionType): void {
        this.connectionType = type;
    }
}