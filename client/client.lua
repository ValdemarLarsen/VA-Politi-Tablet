local personRegister = {}

local function toggleNuiFrame(shouldShow)
	SetNuiFocus(shouldShow, shouldShow)
	SendReactMessage("setVisible", shouldShow)
end

RegisterCommand("tablet", function()
	--[[ if #personRegister == 0 then
		lib.notify({
			title = "Politi Tablet",
			description = "Politi tabletten er ikke klar til brug | Forsøg at gå på job igen..",
			type = "error",
		})
		return
	end ]]

	toggleNuiFrame(true)
	debugPrint("Show NUI frame")
end)

RegisterNUICallback("hideFrame", function(_, cb)
	toggleNuiFrame(false)
	debugPrint("Hide NUI frame")
	cb({})
end)

RegisterNUICallback("getClientData", function(data, cb)
	debugPrint("Data sent by React", json.encode(data))

	-- Lets send back client coords to the React frame for use
	local curCoords = GetEntityCoords(PlayerPedId())

	local retData <const> = { x = curCoords.x, y = curCoords.y, z = curCoords.z }
	cb(retData)
end)


RegisterNUICallback("va-tablet:hentClientPersonRegister", function(data, cb)

	if #personRegister > 0 then
		cb(personRegister)
	else
		cb(false)
	end
end)

AddEventHandler("esx:playerLoaded", function(xPlayer, skin)
	print("The character " .. xPlayer.name .. " successfully loaded")
	if xPlayer.job.name == Config.TabletIndstillinger.politiJob then
		print("Begynd at load politi tablet")
		if #personRegister == 0 then
			personRegister = lib.callback.await("va-tablet:hentPersonRegister", false)
			lib.notify({
				title = "Politi Tablet",
				description = "Politi tabletten er nu klar til brug",
				type = "success",
			})
		end
	end
end)

RegisterNetEvent("esx:setJob")
AddEventHandler("esx:setJob", function(job, lastJob)
	if job.name == Config.TabletIndstillinger.politiJob then
		print("Begynd at load politi tablet")
		if #personRegister == 0 then
			personRegister = lib.callback.await("va-tablet:hentPersonRegister", false)
			lib.notify({
				title = "Politi Tablet",
				description = "Politi tabletten er nu klar til brug",
				type = "success",
			})
		end
	end
end)
