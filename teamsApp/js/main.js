$(document).ready(function() {
    $('#employeeSelect').select2({
		placeholder: "Select an employee",
		'allowClear': true
    });
});


var TeamApp = angular.module('TeamApp', []).controller('MainController', function($scope, $http) {
	$scope.currentTeamId = null;
	
    $http.get('http://demo5534716.mockable.io/retrieveTeams').
        then(function(response) {
            $scope.teams = response.data.teams;
        });
		
	$scope.SaveTeam = function () {
			var selectedEmployees = $('#employeeSelect').select2('data').map(function(item){return item.id;});

            var data = {
                teamName: $scope.teamName,
                members: selectedEmployees,
                numberOfMembers: selectedEmployees.length,
				teamId: $scope.currentTeamId
            };

            $http.post('http://demo5534716.mockable.io/saveTeam', data)
            .success(function () {
                (data.teamId) ? updateTeam($scope, data.teamId, data) : createTeam($scope, data);
				$('#teamDetailsModal').modal('hide');
            });
        };
		
	$scope.formatEmpList = function(empArray) {
		return empArray.join(", ");
	};
});

TeamApp.directive('teamDetails', function() {
	return {
		restrict:'A',
		link: function($scope, element, attrs) {
			$('#teamDetailsModal').on('show.bs.modal', function (event) {
			  var teamId = $(event.relatedTarget).data('team-id');
			  $scope.currentTeamId = teamId;
			  if(teamId) {
				  var teamSelected = _.findWhere($scope.teams, {teamId: teamId});
				  $scope.$apply(function () {
					$scope.teamName = teamSelected.teamName;
				  });
				  $scope.$apply();
				  $('#employeeSelect').val(teamSelected.members).trigger("change");
			  }
			});
	
			$('#teamDetailsModal').on('hidden.bs.modal', function () {
				//clear dialog fields
				$scope.$apply(function () {
				  $scope.teamName = "";
				});
				$('#employeeSelect').val("").trigger("change");
			});
		}
	}
});

TeamApp.directive('teamRow', function() {
	return {
		restrict:'C',
		link: function($scope, element, attrs) {
			$(element).hover(function(){
				$(element).addClass("active");
			}, function(){
				$(element).removeClass("active");
			});
		}
	}
});

function updateTeam($scope, teamId, data) {
	_.each($scope.teams, function(team) {
		if(team.teamId == teamId) {
			team.teamName = data.teamName;
			team.members = data.members;
			team.numberOfMembers = data.members.length;
		}
	});
};

function createTeam($scope, data) {
	data.teamId = $scope.teams.length + 1;
	$scope.teams.push(data);
};