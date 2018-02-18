const mySpawns = Object.values(Game.spawns).filter(spawn => spawn.my); //Array of my spawns
const creeps = Object.values(Game.creeps).filter(creep => creep.my);
const creepTemplates = {
	worker: [WORK, CARRY, MOVE]
};
const workers = Object.values(Game.creeps).filter(creep => {
	const test = new RegExp('worker', 'gi');
	return creep.my && test.test(creep.name);
});

function canCreateCreep(spawn, creepToCreate) {
	const num =
		Math.max(
			...Object.values(creeps).map(key => parseInt(key.name.split('-')[1]))
		) + 1;
	const result = spawn.spawnCreep(creepToCreate, `Worker-${num}`, {
		dryRun: true
	});
	return result;
}

function createCreep(spawn, creepToCreate) {
	const num =
		Math.max(
			...Object.values(creeps).map(key => parseInt(key.name.split('-')[1]))
		) + 1;
	const result = spawn.spawnCreep(creepToCreate, `Worker-${num}`, {
		dryRun: false
	});
	return result;
}

function getTarget(whereWeAre, max) {
	let current = whereWeAre;
	while (current > max) {
		current = current - max;
	}
	return current;
}

mySpawns.forEach(spawn => {
	console.log(canCreateCreep(spawn, creepTemplates.worker));
	if (canCreateCreep(spawn, creepTemplates.worker) === 0) {
		createCreep(spawn, creepTemplates.worker);
	}
});

function goGetResources(creep, target) {
	if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
		creep.moveTo(target);
	}
}

function dropOffResources(creep, target) {
	if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
		creep.moveTo(target);
	}
}

function getAllDropOffs(creep) {
	const spawns = creep.room.find(FIND_MY_SPAWNS);
	const controller = creep.room.controller;
	return [...spawns, controller];
}

workers.forEach((creep, i) => {
	const energySources = creep.room.find(FIND_SOURCES);
	const dropOffs = getAllDropOffs(creep); //returns an array
	const energyInRoom = energySources.length > 0;
	const maxCarry = creep.carryCapacity;
	const currentCarry = Object.values(creep.carry).reduce(
		(accumulator, resource) => accumulator + resource,
		0
	);

	//if the creep has room to carry more energy
	if (currentCarry < maxCarry && energySources.length > 0) {
		const target = energySources[getTarget(i, energySources.length - 1)];
		goGetResources(creep, target);
	} else if (dropOffs.length > 0) {
		const target = dropOffs[getTarget(i, dropOffs.length - 1)];
		dropOffResources(creep, target);
	}
});
