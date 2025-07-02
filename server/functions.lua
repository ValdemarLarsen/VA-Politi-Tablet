CheckPlayerJob = function(xPlayer)
    if xPlayer.getJob().name == Config.TabletIndstillinger.politiJob then
        return true
    end
    return false
end