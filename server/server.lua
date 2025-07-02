local serverPersonRegister = {}

CreateThread(function()
	while true do
		lib.print.info("[POLITI TABLET] Henter personregister - Dette thread kører hvert 5 minut")
		-- Vent i 5 minutter (5 * 60 * 1000 ms = 300000 ms)

		local response = MySQL.rawExecute.await("SELECT `identifier`, `firstname`, `lastname` FROM `users`")
		serverPersonRegister = response
		lib.print.info("[POLITI TABLET] Personregister hentet - Indeholder " .. #serverPersonRegister .. " elementer")

		Wait(Config.Threads.personRegisterOpdatering)
	end
end)

lib.callback.register("va-tablet:hentPersonRegister", function(source)
	local xPlayer = ESX.GetPlayerFromId(source)
	local checkJob = CheckPlayerJob(xPlayer)
	if not checkJob then
		return false
	end

	if #serverPersonRegister > 0 then
		print("Bruger cached data")
		return serverPersonRegister
	else
		local response = MySQL.rawExecute.await("SELECT `identifier`, `firstname`, `lastname` FROM `users`")
		serverPersonRegister = response
		return response
	end
end)
