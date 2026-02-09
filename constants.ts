import { Room, Tenant } from './types';

export const ROOMS: Room[] = [
    {id:"10.014b", n:"studio", a:70, f:0}, {id:"10.014a", n:"před studiem", a:40.2, f:0}, {id:"10.013a", n:"navara", a:37.5, f:0},
    {id:"10.014c", n:"richard", a:29.8, f:0}, {id:"10.013b", n:"navara", a:17.8, f:0}, {id:"10.012b", n:"navara", a:10.2, f:0},
    {id:"10.106", n:"kancelar", a:49.8, f:1}, {id:"10.104", n:"kancelar", a:29.9, f:1}, {id:"10.112", n:"kancelar", a:29.6, f:1},
    {id:"10.116", n:"kancelar", a:28.5, f:1}, {id:"10.114", n:"kancelar", a:23.2, f:1}, {id:"10.107", n:"kancelar", a:20.3, f:1},
    {id:"10.110", n:"kancelar", a:20.3, f:1}, {id:"10.115", n:"kancelar", a:19.9, f:1}, {id:"10.109", n:"kancelar", a:19.5, f:1},
    {id:"10.111", n:"kancelar", a:19.4, f:1}, {id:"10.105", n:"kancelar", a:18.7, f:1}, {id:"10.205", n:"jídelna", a:127.5, f:2},
    {id:"10.211", n:"kancelar", a:30, f:2}, {id:"10.204", n:"kuchyně", a:29, f:2}, {id:"10.213", n:"kancelar", a:28.5, f:2},
    {id:"10.207", n:"kancelar", a:20.4, f:2}, {id:"10.206", n:"kancelar", a:18.7, f:2}, {id:"10.209", n:"kancelar", a:18.1, f:2},
    {id:"10.212", n:"kancelar", a:9.3, f:2}, {id:"10.312a", n:"call-centrum", a:155, f:3}, {id:"10.312b", n:"směr upster", a:50, f:3},
    {id:"10.313", n:"Upster", a:82.6, f:3}, {id:"10.408", n:"kancelar", a:50.2, f:4}, {id:"10.404", n:"kancelar", a:49.6, f:4},
    {id:"10.412", n:"kancelar", a:28.5, f:4}, {id:"10.413", n:"kancelar", a:28.3, f:4}, {id:"10.413a", n:"kancelar", a:20.2, f:4},
    {id:"10.409", n:"kancelar", a:20.1, f:4}, {id:"10.415", n:"kancelar", a:20.1, f:4}, {id:"10.406", n:"kancelar", a:19.6, f:4},
    {id:"10.411", n:"kancelar", a:18.7, f:4}, {id:"10.510", n:"kancelar", a:29.2, f:5}, {id:"10.504", n:"kancelar", a:29.1, f:5},
    {id:"10.517", n:"kancelar", a:28.5, f:5}, {id:"10.519", n:"kancelar", a:28.5, f:5}, {id:"10.515", n:"kancelar", a:28.1, f:5},
    {id:"10.513", n:"kancelar", a:21.7, f:5}, {id:"10.506", n:"kancelar", a:20, f:5}, {id:"10.509", n:"kancelar", a:19.8, f:5},
    {id:"10.514", n:"kancelar", a:19.7, f:5}, {id:"10.507", n:"kancelar", a:19.5, f:5}, {id:"10.516", n:"kancelar", a:10.5, f:5}
];

export const PARKING: string[] = ["1","16","19","21","22","23","24","A","B","C","D","E","F"];

export const DEFAULT_TENANTS: Tenant[] = [
    {
        id: 1, 
        name: 'Svět plodů s.r.o.', 
        ico: '00000000', 
        mail: 'ota.janik@svetplodu.cz', 
        price: 349, 
        disc: 0, 
        dep: 60000, 
        net: true, 
        cln: 0, 
        furn: 0, 
        parkingPrice: 1500,
        contractFile: 'smlouva_svet_plodu_2024.pdf',
        rooms: ['10.106','10.104'], 
        park: ['19','21']
    },
    {
        id: 2, 
        name: 'Upster', 
        ico: '12345678', 
        mail: 'tomasschwarz@upster.com', 
        price: 349, 
        disc: 5, 
        dep: 50000, 
        net: true, 
        cln: 2400, 
        furn: 1500, 
        parkingPrice: 1500,
        rooms: ['10.313','10.312b'], 
        park: ['22','23']
    }
];