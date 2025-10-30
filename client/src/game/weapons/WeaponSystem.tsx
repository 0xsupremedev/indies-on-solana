export interface Weapon {
  id: string
  name: string
  damage: number
  fireRate: number
  range: number
  ammo: number
  maxAmmo: number
  reloadTime: number
  accuracy: number
  projectileType: 'bullet' | 'laser' | 'rocket'
  color: string
  icon: string
}

export const WEAPONS: Weapon[] = [
  {
    id: 'pistol',
    name: 'Pistol',
    damage: 25,
    fireRate: 0.5,
    range: 15,
    ammo: 12,
    maxAmmo: 12,
    reloadTime: 2,
    accuracy: 0.9,
    projectileType: 'bullet',
    color: '#666666',
    icon: '🔫'
  },
  {
    id: 'assault_rifle',
    name: 'Assault Rifle',
    damage: 30,
    fireRate: 0.1,
    range: 20,
    ammo: 30,
    maxAmmo: 30,
    reloadTime: 3,
    accuracy: 0.8,
    projectileType: 'bullet',
    color: '#333333',
    icon: '🔫'
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    damage: 60,
    fireRate: 1.0,
    range: 8,
    ammo: 8,
    maxAmmo: 8,
    reloadTime: 4,
    accuracy: 0.6,
    projectileType: 'bullet',
    color: '#8B4513',
    icon: '🔫'
  },
  {
    id: 'sniper',
    name: 'Sniper Rifle',
    damage: 100,
    fireRate: 2.0,
    range: 30,
    ammo: 5,
    maxAmmo: 5,
    reloadTime: 3,
    accuracy: 0.95,
    projectileType: 'bullet',
    color: '#2F4F4F',
    icon: '🎯'
  },
  {
    id: 'rocket_launcher',
    name: 'Rocket Launcher',
    damage: 150,
    fireRate: 3.0,
    range: 25,
    ammo: 3,
    maxAmmo: 3,
    reloadTime: 5,
    accuracy: 0.7,
    projectileType: 'rocket',
    color: '#8B0000',
    icon: '🚀'
  },
  {
    id: 'laser_rifle',
    name: 'Laser Rifle',
    damage: 40,
    fireRate: 0.2,
    range: 18,
    ammo: 50,
    maxAmmo: 50,
    reloadTime: 2,
    accuracy: 0.85,
    projectileType: 'laser',
    color: '#00ff00',
    icon: '⚡'
  }
]
